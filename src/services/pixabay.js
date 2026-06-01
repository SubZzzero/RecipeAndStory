const PIXABAY_API_URL = 'https://pixabay.com/api/'

export async function fetchRandomFoodImage(signal) {
  const apiKey = import.meta.env.VITE_PIXABAY_KEY

  if (!apiKey) {
    throw new Error('Missing VITE_PIXABAY_KEY in environment variables.')
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: 'food',
    image_type: 'photo',
    per_page: '200',
    safesearch: 'true',
  })

  const response = await fetch(`${PIXABAY_API_URL}?${params.toString()}`, { signal })

  if (!response.ok) {
    throw new Error(`Pixabay request failed with status ${response.status}`)
  }

  const data = await response.json()

  if (!data.hits || data.hits.length === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * data.hits.length)
  const hit = data.hits[randomIndex]

  return {
    imageUrl: hit.largeImageURL,
    imageAlt: hit.tags || 'Food photo',
    imageLink: hit.pageURL || hit.largeImageURL,
    author: hit.user || 'Unknown author',
  }
}
