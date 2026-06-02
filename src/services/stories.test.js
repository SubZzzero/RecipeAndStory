import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchFoodStory } from './stories'

const tomatoTopic = {
  id: 'tomato',
  label: 'Tomato',
  wikiTitle: 'Tomato',
}

function jsonResponse(body) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  })
}

describe('fetchFoodStory', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('prefers the full-size Wikipedia image over the thumbnail', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      jsonResponse({
        title: 'Tomato',
        extract: 'The tomato is the edible berry of the plant Solanum lycopersicum.',
        thumbnail: {
          source: 'https://upload.wikimedia.org/thumb/tomato-low.jpg',
        },
        originalimage: {
          source: 'https://upload.wikimedia.org/wikipedia/commons/tomato-original.jpg',
        },
        content_urls: {
          desktop: {
            page: 'https://en.wikipedia.org/wiki/Tomato',
          },
        },
      }),
    )

    const story = await fetchFoodStory(tomatoTopic)

    expect(story.imageUrl).toBe('https://upload.wikimedia.org/wikipedia/commons/tomato-original.jpg')
  })
})
