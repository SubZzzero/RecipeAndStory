const PIXABAY_API_URL = 'https://pixabay.com/api/'
const RESULTS_PER_PAGE = 50
const MAX_RANDOM_PAGE = 10
const MAX_PAGE_ATTEMPTS = 3

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function parseTags(tags) {
  if (!tags) return []

  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function pickRandomHit(hits) {
  const randomIndex = Math.floor(Math.random() * hits.length)
  return hits[randomIndex]
}

export async function fetchRandomFoodImage(signal, options = {}) {
  const apiKey = import.meta.env.VITE_PIXABAY_KEY
  const excludedIds = new Set(options.excludedIds || [])

  if (!apiKey) {
    throw new Error('Missing VITE_PIXABAY_KEY in environment variables.')
  }

  let fallbackHits = []

  for (let attempt = 0; attempt < MAX_PAGE_ATTEMPTS; attempt += 1) {
    const params = new URLSearchParams({
      key: apiKey,
      q: 'food',
      image_type: 'photo',
      per_page: String(RESULTS_PER_PAGE),
      page: String(getRandomInteger(1, MAX_RANDOM_PAGE)),
      safesearch: 'true',
    })
    const requestUrl = `${PIXABAY_API_URL}?${params.toString()}`

    const response = await fetch(requestUrl, { signal })

    if (!response.ok) {
      throw new Error(`Pixabay request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (!data.hits || data.hits.length === 0) {
      continue
    }

    fallbackHits = data.hits

    const freshHits = data.hits.filter((hit) => !excludedIds.has(hit.id))
    if (freshHits.length > 0) {
      const hit = pickRandomHit(freshHits)
      const tags = parseTags(hit.tags)

      return {
        id: hit.id,
        imageUrl: hit.largeImageURL,
        imageAlt: hit.tags || 'Food photo',
        imageLink: hit.pageURL || hit.largeImageURL,
        author: hit.user || 'Unknown author',
        tags,
      }
    }
  }

  if (fallbackHits.length === 0) {
    return null
  }

  const hit = pickRandomHit(fallbackHits)
  const tags = parseTags(hit.tags)

  return {
    id: hit.id,
    imageUrl: hit.largeImageURL,
    imageAlt: hit.tags || 'Food photo',
    imageLink: hit.pageURL || hit.largeImageURL,
    author: hit.user || 'Unknown author',
    tags,
  }
}
