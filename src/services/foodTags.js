const GENERIC_TOPIC = {
  id: 'food',
  label: 'Food',
  wikiTitle: 'Food',
  recipeQueries: [],
  synonyms: ['food', 'meal', 'cuisine', 'dish'],
}

const FOOD_TOPICS = [
  {
    id: 'potato',
    label: 'Potato',
    wikiTitle: 'Potato',
    recipeQueries: ['Potato', 'Potatoes'],
    synonyms: ['potato', 'potatoes', 'spud'],
  },
  {
    id: 'tomato',
    label: 'Tomato',
    wikiTitle: 'Tomato',
    recipeQueries: ['Tomato'],
    synonyms: ['tomato', 'tomatoes'],
  },
  {
    id: 'rice',
    label: 'Rice',
    wikiTitle: 'Rice',
    recipeQueries: ['Rice'],
    synonyms: ['rice', 'risotto', 'pilaf'],
  },
  {
    id: 'pasta',
    label: 'Pasta',
    wikiTitle: 'Pasta',
    recipeQueries: ['Pasta', 'Spaghetti', 'Lasagne'],
    synonyms: ['pasta', 'spaghetti', 'macaroni', 'noodle', 'noodles', 'lasagna', 'lasagne'],
  },
  {
    id: 'chicken',
    label: 'Chicken',
    wikiTitle: 'Chicken as food',
    recipeQueries: ['Chicken'],
    synonyms: ['chicken', 'poultry'],
  },
  {
    id: 'beef',
    label: 'Beef',
    wikiTitle: 'Beef',
    recipeQueries: ['Beef', 'Steak'],
    synonyms: ['beef', 'steak', 'veal'],
  },
  {
    id: 'pork',
    label: 'Pork',
    wikiTitle: 'Pork',
    recipeQueries: ['Pork'],
    synonyms: ['pork', 'bacon', 'ham', 'sausage'],
  },
  {
    id: 'fish',
    label: 'Fish',
    wikiTitle: 'Fish as food',
    recipeQueries: ['Fish', 'Salmon', 'Tuna'],
    synonyms: ['fish', 'salmon', 'tuna', 'cod', 'seafood'],
  },
  {
    id: 'egg',
    label: 'Egg',
    wikiTitle: 'Egg as food',
    recipeQueries: ['Egg', 'Omelette'],
    synonyms: ['egg', 'eggs', 'omelette', 'omelet'],
  },
  {
    id: 'cheese',
    label: 'Cheese',
    wikiTitle: 'Cheese',
    recipeQueries: ['Cheese'],
    synonyms: ['cheese', 'mozzarella', 'cheddar', 'parmesan', 'feta'],
  },
  {
    id: 'bread',
    label: 'Bread',
    wikiTitle: 'Bread',
    recipeQueries: ['Bread'],
    synonyms: ['bread', 'baguette', 'toast', 'loaf', 'buns', 'bun'],
  },
  {
    id: 'cake',
    label: 'Cake',
    wikiTitle: 'Cake',
    recipeQueries: ['Cake'],
    synonyms: ['cake', 'cupcake', 'dessert', 'pastry'],
  },
  {
    id: 'chocolate',
    label: 'Chocolate',
    wikiTitle: 'Chocolate',
    recipeQueries: ['Chocolate'],
    synonyms: ['chocolate', 'cocoa', 'cacao'],
  },
  {
    id: 'apple',
    label: 'Apple',
    wikiTitle: 'Apple',
    recipeQueries: ['Apple'],
    synonyms: ['apple', 'apples'],
  },
  {
    id: 'banana',
    label: 'Banana',
    wikiTitle: 'Banana',
    recipeQueries: ['Banana'],
    synonyms: ['banana', 'bananas'],
  },
  {
    id: 'orange',
    label: 'Orange',
    wikiTitle: 'Orange (fruit)',
    recipeQueries: ['Orange'],
    synonyms: ['orange', 'oranges', 'citrus'],
  },
  {
    id: 'strawberry',
    label: 'Strawberry',
    wikiTitle: 'Strawberry',
    recipeQueries: ['Strawberry'],
    synonyms: ['strawberry', 'strawberries'],
  },
  {
    id: 'grape',
    label: 'Grape',
    wikiTitle: 'Grape',
    recipeQueries: ['Grape', 'Grapes'],
    synonyms: ['grape', 'grapes'],
  },
  {
    id: 'blueberry',
    label: 'Blueberry',
    wikiTitle: 'Blueberry',
    recipeQueries: ['Blueberry', 'Blueberries'],
    synonyms: ['blueberry', 'blueberries'],
  },
  {
    id: 'lemon',
    label: 'Lemon',
    wikiTitle: 'Lemon',
    recipeQueries: ['Lemon'],
    synonyms: ['lemon', 'lemons', 'lime', 'limes'],
  },
  {
    id: 'mushroom',
    label: 'Mushroom',
    wikiTitle: 'Edible mushroom',
    recipeQueries: ['Mushroom'],
    synonyms: ['mushroom', 'mushrooms', 'fungi'],
  },
  {
    id: 'corn',
    label: 'Corn',
    wikiTitle: 'Maize',
    recipeQueries: ['Corn'],
    synonyms: ['corn', 'maize', 'sweetcorn'],
  },
  {
    id: 'carrot',
    label: 'Carrot',
    wikiTitle: 'Carrot',
    recipeQueries: ['Carrot'],
    synonyms: ['carrot', 'carrots'],
  },
  {
    id: 'onion',
    label: 'Onion',
    wikiTitle: 'Onion',
    recipeQueries: ['Onion'],
    synonyms: ['onion', 'onions', 'shallot', 'shallots'],
  },
  {
    id: 'garlic',
    label: 'Garlic',
    wikiTitle: 'Garlic',
    recipeQueries: ['Garlic'],
    synonyms: ['garlic'],
  },
  {
    id: 'pepper',
    label: 'Pepper',
    wikiTitle: 'Bell pepper',
    recipeQueries: ['Pepper'],
    synonyms: ['pepper', 'peppers', 'paprika', 'chili', 'chilli'],
  },
  {
    id: 'avocado',
    label: 'Avocado',
    wikiTitle: 'Avocado',
    recipeQueries: ['Avocado'],
    synonyms: ['avocado', 'avocados'],
  },
  {
    id: 'pumpkin',
    label: 'Pumpkin',
    wikiTitle: 'Pumpkin',
    recipeQueries: ['Pumpkin'],
    synonyms: ['pumpkin', 'squash'],
  },
  {
    id: 'cucumber',
    label: 'Cucumber',
    wikiTitle: 'Cucumber',
    recipeQueries: ['Cucumber'],
    synonyms: ['cucumber', 'cucumbers'],
  },
  {
    id: 'bean',
    label: 'Beans',
    wikiTitle: 'Bean',
    recipeQueries: ['Bean', 'Beans'],
    synonyms: ['bean', 'beans', 'lentil', 'lentils', 'peas'],
  },
  {
    id: 'shrimp',
    label: 'Shrimp',
    wikiTitle: 'Shrimp and prawn as food',
    recipeQueries: ['Shrimp', 'Prawn'],
    synonyms: ['shrimp', 'prawn', 'prawns'],
  },
  {
    id: 'pizza',
    label: 'Pizza',
    wikiTitle: 'Pizza',
    recipeQueries: ['Pizza'],
    synonyms: ['pizza'],
  },
  {
    id: 'burger',
    label: 'Burger',
    wikiTitle: 'Hamburger',
    recipeQueries: ['Burger'],
    synonyms: ['burger', 'hamburger', 'cheeseburger'],
  },
  {
    id: 'soup',
    label: 'Soup',
    wikiTitle: 'Soup',
    recipeQueries: ['Soup'],
    synonyms: ['soup', 'broth', 'stew'],
  },
  {
    id: 'salad',
    label: 'Salad',
    wikiTitle: 'Salad',
    recipeQueries: ['Salad'],
    synonyms: ['salad', 'greens', 'lettuce'],
  },
  {
    id: 'sushi',
    label: 'Sushi',
    wikiTitle: 'Sushi',
    recipeQueries: ['Sushi'],
    synonyms: ['sushi', 'sashimi'],
  },
  {
    id: 'coffee',
    label: 'Coffee',
    wikiTitle: 'Coffee',
    recipeQueries: ['Coffee'],
    synonyms: ['coffee', 'espresso', 'latte', 'cappuccino'],
  },
]

function normalizeTag(tag) {
  return tag
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getCandidateTags(tags) {
  return tags
    .map(normalizeTag)
    .filter(Boolean)
    .flatMap((tag) => [tag, ...tag.split(' ')])
    .filter((tag) => tag.length > 2)
}

function findTopicByTag(tag) {
  return FOOD_TOPICS.find((topic) => topic.synonyms.includes(tag))
}

export function resolveFoodTopic(tags = []) {
  const candidates = getCandidateTags(tags)
  const directMatch = candidates.map(findTopicByTag).find(Boolean)

  if (directMatch) {
    return {
      ...directMatch,
      confidence: 'high',
      isFallback: false,
      triedTags: candidates,
    }
  }

  return {
    ...GENERIC_TOPIC,
    confidence: 'none',
    isFallback: true,
    triedTags: candidates,
  }
}

export { FOOD_TOPICS }
