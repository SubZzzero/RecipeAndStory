import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import ImageCard from './components/ImageCard'
import RandomButton from './components/RandomButton'
import Footer from './components/Footer'
import { fetchRandomFoodImage } from './services/pixabay'
import styles from './App.module.css'

const DEFAULT_IMAGE = '/img/default_2.png'
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
  if (status === 'loading') return 'Collecting a fresh meal shot...'
  if (status === 'error') return 'Something went wrong. Please try again.'
  if (status === 'empty') return 'No photos found right now. Try again.'
  return 'Tap the button to discover a random food image.'
}

export default function App() {
  const [status, setStatus] = useState('idle')
  const [image, setImage] = useState({
    imageUrl: DEFAULT_IMAGE,
    imageAlt: 'Default food placeholder',
    imageLink: '',
    author: 'Foodsum',
  })

  const requestControllerRef = useRef(null)
  const bgAnimationCleanupRef = useRef(null)

  const handleRandomPhoto = useCallback(async () => {
    if (requestControllerRef.current) {
      requestControllerRef.current.abort()
    }

    const controller = new AbortController()
    requestControllerRef.current = controller

    setStatus('loading')

    try {
      const [nextImage] = await Promise.all([
        fetchRandomFoodImage(controller.signal),
        new Promise((resolve) => setTimeout(resolve, MIN_TRANSITION_MS)),
      ])

      if (!nextImage) {
        setStatus('empty')
        return
      }

      await preloadImage(nextImage.imageUrl)
      setImage(nextImage)
      setStatus('success')
    } catch (error) {
      if (error.name === 'AbortError') {
        return
      }
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const applyDynamicBackground = async () => {
      if (!image.imageUrl || image.imageUrl === DEFAULT_IMAGE) {
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

  return (
    <div className={styles.appShell}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Daily visual inspiration</p>
          <h1 className={styles.title}>Find your next food mood</h1>
          <p className={styles.subtitle}>
            One tap, one random high-resolution food photo from Pixabay.
          </p>
        </div>

        <ImageCard
          imageUrl={image.imageUrl}
          imageAlt={image.imageAlt}
          imageLink={image.imageLink}
          status={status}
          message={getStatusMessage(status)}
          author={image.author}
        />

        <div className={styles.actions}>
          <RandomButton isLoading={isLoading} onClick={handleRandomPhoto} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
