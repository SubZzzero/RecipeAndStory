import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import ImageCard from './components/ImageCard'
import Footer from './components/Footer'
import DiscoveryCard from './components/DiscoveryCard'
import DetailModal from './components/DetailModal'
import { fetchRandomFoodImage } from './services/pixabay'
import { resolveFoodTopic } from './services/foodTags'
import { fetchFoodStory } from './services/stories'
import { fetchRecipeForTopic } from './services/recipes'
import styles from './App.module.css'

const MIN_TRANSITION_MS = 320

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = reject
    img.src = url
  })
}

function clampColor(value) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function rgbToCss(rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

function parseRgbString(value, fallback) {
  const match = value.match(/\d+/g)
  if (!match || match.length < 3) return fallback
  return {
    r: clampColor(Number(match[0])),
    g: clampColor(Number(match[1])),
    b: clampColor(Number(match[2])),
  }
}

function tintColor(rgb, amount) {
  return {
    r: clampColor(rgb.r + (255 - rgb.r) * amount),
    g: clampColor(rgb.g + (255 - rgb.g) * amount),
    b: clampColor(rgb.b + (255 - rgb.b) * amount),
  }
}

async function extractAverageColor(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        const size = 28
        canvas.width = size
        canvas.height = size
        ctx.drawImage(img, 0, 0, size, size)

        const { data } = ctx.getImageData(0, 0, size, size)
        let r = 0
        let g = 0
        let b = 0
        let count = 0

        for (let i = 0; i < data.length; i += 4) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          count += 1
        }

        resolve({
          r: clampColor(r / count),
          g: clampColor(g / count),
          b: clampColor(b / count),
        })
      } catch (error) {
        reject(error)
      }
    }
    img.onerror = reject
    img.src = imageUrl
  })
}

function animateBackgroundColors(from1, to1, from2, to2, fromGlowLeft, toGlowLeft, fromGlowRight, toGlowRight, duration = 650) {
  let frameId = null
  const start = performance.now()

  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    const mix = (a, b) => clampColor(a + (b - a) * eased)

    const next1 = {
      r: mix(from1.r, to1.r),
      g: mix(from1.g, to1.g),
      b: mix(from1.b, to1.b),
    }
    const next2 = {
      r: mix(from2.r, to2.r),
      g: mix(from2.g, to2.g),
      b: mix(from2.b, to2.b),
    }
    const nextGlowLeft = {
      r: mix(fromGlowLeft.r, toGlowLeft.r),
      g: mix(fromGlowLeft.g, toGlowLeft.g),
      b: mix(fromGlowLeft.b, toGlowLeft.b),
    }
    const nextGlowRight = {
      r: mix(fromGlowRight.r, toGlowRight.r),
      g: mix(fromGlowRight.g, toGlowRight.g),
      b: mix(fromGlowRight.b, toGlowRight.b),
    }

    document.documentElement.style.setProperty('--bg-1', rgbToCss(next1))
    document.documentElement.style.setProperty('--bg-2', rgbToCss(next2))
    document.documentElement.style.setProperty('--bg-glow-left', rgbToCss(nextGlowLeft))
    document.documentElement.style.setProperty('--bg-glow-right', rgbToCss(nextGlowRight))

    if (progress < 1) {
      frameId = requestAnimationFrame(tick)
    }
  }

  frameId = requestAnimationFrame(tick)
  return () => {
    if (frameId) cancelAnimationFrame(frameId)
  }
}

function getStatusMessage(status) {
  if (status === 'loading') return 'Collecting a fresh food discovery...'
  if (status === 'error') return 'Something went wrong. Please try again.'
  if (status === 'empty') return 'No photos found right now. Try again.'
  return 'Tap the button to discover another food image.'
}

function getPreviewRecipeText(recipe) {
  if (!recipe) return 'Looking for a recipe that fits this image.'

  const intro = recipe.isExactMatch ? 'Matched from the detected food tag.' : 'A related inspiration pick.'
  const area = recipe.area ? `${recipe.area} ` : ''
  const category = recipe.category ? `${recipe.category.toLowerCase()} recipe` : 'recipe'

  return `${intro} This ${area}${category} comes with ingredients and full cooking instructions.`
}

function getRecipeMeta(recipe) {
  if (!recipe) return 'Searching TheMealDB'

  const parts = [recipe.isExactMatch ? 'Tag match' : 'Inspiration']

  if (recipe.area) parts.push(recipe.area)
  if (recipe.category) parts.push(recipe.category)

  return parts.join(' · ')
}

function getDiscoveryFallback() {
  return {
    story: {
      title: 'A Small Food Discovery',
      topicLabel: 'Food',
      sourceLabel: 'Foodsum fallback',
      sourceUrl: 'https://en.wikipedia.org/wiki/Food',
      excerpt: 'Every food image can start with a simple question: what ingredient, technique, or tradition is hiding in plain sight?',
      body: 'Every food image can start with a simple question: what ingredient, technique, or tradition is hiding in plain sight?',
    },
    recipe: null,
    topic: {
      label: 'Food',
      isFallback: true,
    },
  }
}

export default function App() {
  const [status, setStatus] = useState('loading')
  const [image, setImage] = useState({
    imageUrl: '',
    imageAlt: 'Food image',
    imageLink: '',
    author: 'Foodsum',
    tags: [],
  })
  const [discovery, setDiscovery] = useState(getDiscoveryFallback)
  const [activeDetail, setActiveDetail] = useState(null)

  const requestControllerRef = useRef(null)
  const bgAnimationCleanupRef = useRef(null)
  const hasAppliedDynamicBgRef = useRef(false)

  const handleRandomPhoto = useCallback(async (options = {}) => {
    const { isInitial = false } = options

    if (requestControllerRef.current) {
      requestControllerRef.current.abort()
    }

    const controller = new AbortController()
    requestControllerRef.current = controller

    setStatus('loading')
    setActiveDetail(null)

    try {
      const waitTransition = isInitial
        ? Promise.resolve()
        : new Promise((resolve) => setTimeout(resolve, MIN_TRANSITION_MS))

      const [nextImage] = await Promise.all([
        fetchRandomFoodImage(controller.signal),
        waitTransition,
      ])

      if (!nextImage) {
        setStatus('empty')
        return
      }

      await preloadImage(nextImage.imageUrl)
      const nextTopic = resolveFoodTopic(nextImage.tags)
      const [storyResult, recipeResult] = await Promise.allSettled([
        fetchFoodStory(nextTopic, controller.signal),
        fetchRecipeForTopic(nextTopic, controller.signal),
      ])

      if (controller.signal.aborted) {
        return
      }

      const fallbackDiscovery = getDiscoveryFallback()

      setImage(nextImage)
      setDiscovery({
        topic: nextTopic,
        story:
          storyResult.status === 'fulfilled'
            ? storyResult.value
            : {
                ...fallbackDiscovery.story,
                topicLabel: nextTopic.label,
              },
        recipe: recipeResult.status === 'fulfilled' ? recipeResult.value : null,
      })
      setStatus('success')
    } catch (error) {
      if (error.name === 'AbortError') {
        return
      }
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    const initialRequestId = window.setTimeout(() => {
      handleRandomPhoto({ isInitial: true })
    }, 0)

    return () => {
      window.clearTimeout(initialRequestId)
    }
  }, [handleRandomPhoto])

  useEffect(() => {
    let isActive = true

    const applyDynamicBackground = async () => {
      if (!image.imageUrl) {
        return
      }

      try {
        const avgColor = await extractAverageColor(image.imageUrl)
        if (!isActive) return

        const midTint = tintColor(avgColor, 0.45)
        const lightTint = tintColor(avgColor, 0.7)
        const glowLeftTint = tintColor(avgColor, 0.8)
        const glowRightTint = tintColor(avgColor, 0.62)
        const rootStyle = getComputedStyle(document.documentElement)
        const currentBg1 = parseRgbString(rootStyle.getPropertyValue('--bg-1'), lightTint)
        const currentBg2 = parseRgbString(rootStyle.getPropertyValue('--bg-2'), midTint)
        const currentGlowLeft = parseRgbString(
          rootStyle.getPropertyValue('--bg-glow-left'),
          glowLeftTint,
        )
        const currentGlowRight = parseRgbString(
          rootStyle.getPropertyValue('--bg-glow-right'),
          glowRightTint,
        )

        if (!hasAppliedDynamicBgRef.current) {
          document.documentElement.style.setProperty('--bg-1', rgbToCss(lightTint))
          document.documentElement.style.setProperty('--bg-2', rgbToCss(midTint))
          document.documentElement.style.setProperty('--bg-glow-left', rgbToCss(glowLeftTint))
          document.documentElement.style.setProperty('--bg-glow-right', rgbToCss(glowRightTint))
          hasAppliedDynamicBgRef.current = true
          return
        }

        if (bgAnimationCleanupRef.current) {
          bgAnimationCleanupRef.current()
        }

        bgAnimationCleanupRef.current = animateBackgroundColors(
          currentBg1,
          lightTint,
          currentBg2,
          midTint,
          currentGlowLeft,
          glowLeftTint,
          currentGlowRight,
          glowRightTint,
        )
      } catch {
        // Keep default colors if canvas sampling is blocked by CORS or fails.
      }
    }

    applyDynamicBackground()

    return () => {
      isActive = false
      if (bgAnimationCleanupRef.current) {
        bgAnimationCleanupRef.current()
      }
    }
  }, [image.imageUrl])

  const isLoading = status === 'loading'
  const storyTitle = isLoading ? 'Building today’s food story' : discovery.story.title
  const storyText = isLoading
    ? 'Reading the selected tags and looking for a useful origin note.'
    : discovery.story.excerpt
  const recipeTitle = isLoading
    ? 'Finding a related recipe'
    : discovery.recipe?.title || 'Recipe inspiration'
  const recipeText = isLoading
    ? 'Checking TheMealDB for a recipe that fits the detected food topic.'
    : getPreviewRecipeText(discovery.recipe)
  const topicLabel = discovery.topic?.label || 'Food'

  return (
    <div className={styles.appShell}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Daily visual inspiration</p>
          <h1 className={styles.title}>Find your next food mood</h1>
          <p className={styles.subtitle}>
            One tap turns a random Pixabay food photo into a short story and a recipe lead.
          </p>
        </div>

        <div className={styles.discoveryGrid}>
          <div className={styles.photoPanel}>
            <ImageCard
              imageUrl={image.imageUrl}
              imageAlt={image.imageAlt}
              imageLink={image.imageLink}
              status={status}
              message={getStatusMessage(status)}
              author={image.author}
              tags={image.tags}
              topicLabel={topicLabel}
              isLoading={isLoading}
              onRandomPhoto={handleRandomPhoto}
            />
          </div>

          <aside className={styles.companionPanel} aria-label="Food story and recipe">
            <DiscoveryCard
              eyebrow="Today’s food story"
              title={storyTitle}
              text={storyText}
              imageUrl={image.imageUrl}
              imageAlt={image.imageAlt}
              meta={isLoading ? 'Resolving tags' : discovery.story.sourceLabel}
              buttonLabel="Read full story"
              isLoading={isLoading}
              onOpen={() => setActiveDetail('story')}
            />

            <DiscoveryCard
              eyebrow="Today’s recipe"
              title={recipeTitle}
              text={recipeText}
              imageUrl={discovery.recipe?.imageUrl || image.imageUrl}
              imageAlt={discovery.recipe?.title || image.imageAlt}
              meta={getRecipeMeta(discovery.recipe)}
              buttonLabel="View full recipe"
              isLoading={isLoading}
              onOpen={() => setActiveDetail('recipe')}
            />
          </aside>
        </div>
      </main>

      <Footer />

      {activeDetail === 'story' ? (
        <DetailModal
          title={discovery.story.title}
          subtitle={`${topicLabel} story`}
          imageUrl={image.imageUrl}
          imageAlt={image.imageAlt}
          sourceUrl={discovery.story.sourceUrl}
          onClose={() => setActiveDetail(null)}
        >
          <p>{discovery.story.body}</p>
        </DetailModal>
      ) : null}

      {activeDetail === 'recipe' ? (
        <DetailModal
          title={discovery.recipe?.title || 'Recipe inspiration'}
          subtitle={getRecipeMeta(discovery.recipe)}
          imageUrl={discovery.recipe?.imageUrl || image.imageUrl}
          imageAlt={discovery.recipe?.title || image.imageAlt}
          sourceUrl={discovery.recipe?.sourceUrl}
          onClose={() => setActiveDetail(null)}
        >
          {discovery.recipe ? (
            <>
              <p>{discovery.recipe.instructions}</p>
              {discovery.recipe.ingredients.length > 0 ? (
                <div>
                  <strong>Ingredients</strong>
                  <ul>
                    {discovery.recipe.ingredients.map((ingredient) => (
                      <li key={ingredient}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <p>The recipe service did not return a usable match, but the photo and story are still ready.</p>
          )}
        </DetailModal>
      ) : null}
    </div>
  )
}
