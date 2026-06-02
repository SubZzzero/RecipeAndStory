const MEALDB_API_URL = 'https://www.themealdb.com/api/json/v1/1/'

function getMealIngredients(meal) {
  const ingredients = []

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`]?.trim()
    const measure = meal[`strMeasure${index}`]?.trim()

    if (ingredient) {
      ingredients.push(measure ? `${measure} ${ingredient}` : ingredient)
    }
  }

  return ingredients
}

function toRecipe(meal, meta = {}) {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory,
    area: meal.strArea,
    imageUrl: meal.strMealThumb,
    sourceUrl: meal.strSource || meal.strYoutube || `https://www.themealdb.com/meal/${meal.idMeal}`,
    videoUrl: meal.strYoutube,
    instructions: meal.strInstructions || 'No instructions were provided for this recipe.',
    ingredients: getMealIngredients(meal),
    isExactMatch: meta.isExactMatch,
    matchedQuery: meta.matchedQuery,
  }
}

async function requestMealDb(path, signal) {
  const response = await fetch(`${MEALDB_API_URL}${path}`, { signal })

  if (!response.ok) {
    throw new Error(`TheMealDB request failed with status ${response.status}`)
  }

  return response.json()
}

async function searchByName(query, signal) {
  const data = await requestMealDb(`search.php?s=${encodeURIComponent(query)}`, signal)
  return data.meals?.[0] || null
}

async function filterByIngredient(query, signal) {
  const data = await requestMealDb(`filter.php?i=${encodeURIComponent(query)}`, signal)
  const match = data.meals?.[0]

  if (!match) return null

  const details = await requestMealDb(`lookup.php?i=${encodeURIComponent(match.idMeal)}`, signal)
  return details.meals?.[0] || null
}

async function getRandomMeal(signal) {
  const data = await requestMealDb('random.php', signal)
  return data.meals?.[0] || null
}

export async function fetchRecipeForTopic(topic, signal) {
  const queries = [...new Set([...(topic.recipeQueries || []), ...(topic.synonyms || [])])]

  for (const query of queries) {
    const meal = await searchByName(query, signal)

    if (meal) {
      return toRecipe(meal, {
        isExactMatch: !topic.isFallback,
        matchedQuery: query,
      })
    }
  }

  for (const query of queries) {
    const meal = await filterByIngredient(query, signal)

    if (meal) {
      return toRecipe(meal, {
        isExactMatch: !topic.isFallback,
        matchedQuery: query,
      })
    }
  }

  const randomMeal = await getRandomMeal(signal)

  if (!randomMeal) {
    return null
  }

  return toRecipe(randomMeal, {
    isExactMatch: false,
    matchedQuery: 'random inspiration',
  })
}
