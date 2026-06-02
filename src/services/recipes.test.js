import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchRecipeForTopic } from './recipes'

const highConfidenceTopic = {
  id: 'tomato',
  label: 'Tomato',
  confidence: 'high',
  isFallback: false,
  recipeQueries: ['Tomato'],
  synonyms: ['tomato'],
}

function jsonResponse(body) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  })
}

describe('fetchRecipeForTopic', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null when TheMealDB has no match and never requests a random meal', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => jsonResponse({ meals: null }))

    const recipe = await fetchRecipeForTopic(highConfidenceTopic)
    const requestedUrls = fetchMock.mock.calls.map(([url]) => String(url))

    expect(recipe).toBeNull()
    expect(requestedUrls).not.toEqual(expect.arrayContaining([expect.stringContaining('random.php')]))
  })

  it('returns an exact recipe for a topic name match', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      jsonResponse({
        meals: [
          {
            idMeal: '52772',
            strMeal: 'Tomato Pasta',
            strCategory: 'Vegetarian',
            strArea: 'Italian',
            strMealThumb: 'https://example.com/tomato-pasta.jpg',
            strSource: 'https://example.com/tomato-pasta',
            strYoutube: '',
            strInstructions: 'Boil pasta. Add tomato sauce.',
            strIngredient1: 'Tomato',
            strMeasure1: '2 cups',
          },
        ],
      }),
    )

    const recipe = await fetchRecipeForTopic(highConfidenceTopic)

    expect(recipe).toMatchObject({
      id: '52772',
      title: 'Tomato Pasta',
      category: 'Vegetarian',
      area: 'Italian',
      isExactMatch: true,
      matchedQuery: 'Tomato',
      ingredients: ['2 cups Tomato'],
    })
  })
})
