const WIKIPEDIA_SUMMARY_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

const CURATED_STORIES = {
  potato: {
    title: 'The Humble Potato',
    sourceLabel: 'Curated food note',
    sourceUrl: 'https://en.wikipedia.org/wiki/Potato',
    excerpt:
      'The potato was first domesticated in the Andes thousands of years ago, then traveled across oceans to become one of the world’s most important comfort foods.',
    body:
      'The potato began as an Andean crop and became a global staple after it reached Europe in the 16th century. Its real power was practical: it grew in difficult climates, fed large families, and could become almost anything at the table. Fries, mash, dumplings, gratins, stews, and crisp roasted potatoes all come from that quiet versatility.',
  },
  tomato: {
    title: 'The Fruit That Became a Sauce',
    sourceLabel: 'Curated food note',
    sourceUrl: 'https://en.wikipedia.org/wiki/Tomato',
    excerpt:
      'Tomatoes moved from the Americas into Mediterranean kitchens and slowly became the bright backbone of sauces, salads, soups, and stews.',
    body:
      'The tomato is native to the Americas, but its modern culinary identity was shaped heavily around the Mediterranean. It was not instantly accepted everywhere; over time, cooks learned that its acidity, sweetness, and color could hold a dish together. That is why tomato works as a sauce base, a fresh salad note, a soup, and a slow-cooked stew ingredient.',
  },
  rice: {
    title: 'A Grain With Many Homes',
    sourceLabel: 'Curated food note',
    sourceUrl: 'https://en.wikipedia.org/wiki/Rice',
    excerpt:
      'Rice is one of humanity’s great staple grains, carrying very different traditions from pilaf and risotto to congee, biryani, and sushi.',
    body:
      'Rice matters because it adapts to place. In one kitchen it becomes a creamy risotto, in another a spiced biryani, a quiet bowl of congee, or the structure of sushi. The same grain can be fragrant, sticky, fluffy, toasted, or almost porridge-like depending on water, heat, and patience.',
  },
  pasta: {
    title: 'Shape, Sauce, and Timing',
    sourceLabel: 'Curated food note',
    sourceUrl: 'https://en.wikipedia.org/wiki/Pasta',
    excerpt:
      'Pasta is built around a simple idea: the shape is not decoration, it decides how sauce, texture, and bite work together.',
    body:
      'Pasta looks simple, but its variety is functional. Ridges catch thick sauces, tubes hold ragù, thin strands work with oil and seafood, and sheets become lasagne. The pleasure is in timing: a firm bite, sauce that clings, and starch-rich water that helps everything become one dish.',
  },
  chicken: {
    title: 'The Everyday Protein',
    sourceLabel: 'Curated food note',
    sourceUrl: 'https://en.wikipedia.org/wiki/Chicken_as_food',
    excerpt:
      'Chicken became a global kitchen constant because it takes on spices, broths, smoke, crisp skin, and slow roasting with equal ease.',
    body:
      'Chicken is less about one tradition and more about range. It can be poached gently, roasted until crisp, grilled over smoke, simmered in curry, folded into soup, or fried. Because the flavor is mild, the surrounding technique becomes the story: spice, fat, stock, acid, and heat all leave a clear mark.',
  },
  cheese: {
    title: 'Milk, Time, and Texture',
    sourceLabel: 'Curated food note',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cheese',
    excerpt:
      'Cheese is one of the oldest ways of preserving milk, turning freshness into texture, salt, aroma, and deep savory flavor.',
    body:
      'Cheese began as preservation and became craft. Milk, cultures, salt, pressure, and time create an enormous range: fresh and soft, sharp and crumbly, elastic and melting, or aged and crystalline. That is why cheese can be a quiet garnish, the center of a board, or the entire reason a dish works.',
  },
  bread: {
    title: 'The Table’s Oldest Anchor',
    sourceLabel: 'Curated food note',
    sourceUrl: 'https://en.wikipedia.org/wiki/Bread',
    excerpt:
      'Bread turns grain into something shareable, from flatbreads and baguettes to dense rye, soft buns, and sourdough loaves.',
    body:
      'Bread is one of the most universal food ideas: grain, water, heat, and often fermentation. Its form changes with climate, flour, ovens, and meals. It can scoop, sandwich, absorb sauce, carry butter, or stand alone with a crackling crust and a warm crumb.',
  },
  mushroom: {
    title: 'The Forest Flavor',
    sourceLabel: 'Curated food note',
    sourceUrl: 'https://en.wikipedia.org/wiki/Edible_mushroom',
    excerpt:
      'Mushrooms bring deep savory flavor without needing much: heat, fat, salt, and patience unlock their earthy intensity.',
    body:
      'Edible mushrooms are prized because they concentrate aroma and umami. A crowded pan makes them steam; a hot pan lets moisture escape and flavor deepen. That is why mushrooms can make a simple toast feel rich, give soup a darker base, or make a vegetarian dish feel substantial.',
  },
  apple: {
    title: 'Sweet, Sharp, and Storable',
    sourceLabel: 'Curated food note',
    sourceUrl: 'https://en.wikipedia.org/wiki/Apple',
    excerpt:
      'Apples became beloved partly because they store well and shift easily between crisp snacks, pies, sauces, cider, and savory pairings.',
    body:
      'The apple’s culinary strength is balance. Sweetness, acidity, and firm texture make it work raw, baked, stewed, pressed, or paired with pork and cheese. Different varieties change the dish: some collapse into sauce, some hold their shape, and some are best eaten cold and crisp.',
  },
  chocolate: {
    title: 'From Cacao to Comfort',
    sourceLabel: 'Curated food note',
    sourceUrl: 'https://en.wikipedia.org/wiki/Chocolate',
    excerpt:
      'Chocolate begins with cacao and becomes an entire world of bitterness, sweetness, roasting, melting texture, and ritual.',
    body:
      'Chocolate’s journey starts with cacao beans, fermentation, drying, roasting, and grinding. What makes it memorable is contrast: bitter and sweet, solid and melting, luxurious and everyday. It can be a drink, a glaze, a cake, a sauce, or the small square that finishes a meal.',
  },
}

const GENERIC_STORY = {
  title: 'A Small Food Discovery',
  sourceLabel: 'Foodsum fallback',
  sourceUrl: 'https://en.wikipedia.org/wiki/Food',
  excerpt:
    'Food carries more than calories: every ingredient has a route through climate, trade, technique, memory, and the people who cook it.',
  body:
    'When a photo does not point to one clear ingredient, it can still start a good question: what texture is in front of us, what technique shaped it, and what kind of meal would make it shine? Food is a chain of choices, from growing and preserving to seasoning, serving, and sharing.',
}

function getCuratedStory(topic) {
  return CURATED_STORIES[topic.id]
}

function toStoryFromWikipedia(data, topic) {
  const extract = data.extract || ''

  if (!extract) {
    return null
  }

  return {
    title: data.title || topic.label,
    sourceLabel: 'Wikipedia summary',
    sourceUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${topic.wikiTitle}`,
    excerpt: extract.length > 180 ? `${extract.slice(0, 177).trim()}...` : extract,
    body: extract,
  }
}

export async function fetchFoodStory(topic, signal) {
  const curated = getCuratedStory(topic)

  if (curated) {
    return {
      ...curated,
      topicLabel: topic.label,
    }
  }

  try {
    const response = await fetch(`${WIKIPEDIA_SUMMARY_URL}${encodeURIComponent(topic.wikiTitle)}`, {
      signal,
    })

    if (!response.ok) {
      throw new Error(`Wikipedia request failed with status ${response.status}`)
    }

    const story = toStoryFromWikipedia(await response.json(), topic)

    return {
      ...(story || GENERIC_STORY),
      topicLabel: topic.label,
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    return {
      ...GENERIC_STORY,
      topicLabel: topic.label,
    }
  }
}
