import { describe, expect, it } from 'vitest'
import { resolveFoodTopic } from './foodTags'

describe('resolveFoodTopic', () => {
  it('returns generic Food with no confidence for non-food metadata tags', () => {
    const topic = resolveFoodTopic(['copyright', 'food'])

    expect(topic).toMatchObject({
      id: 'food',
      label: 'Food',
      confidence: 'none',
      isFallback: true,
      recipeQueries: [],
    })
  })

  it('resolves grapes as a high-confidence food topic', () => {
    const topic = resolveFoodTopic(['grapes', 'fruits', 'food', 'fresh'])

    expect(topic).toMatchObject({
      id: 'grape',
      label: 'Grape',
      confidence: 'high',
      isFallback: false,
    })
  })

  it('resolves blueberries as a high-confidence food topic', () => {
    const topic = resolveFoodTopic(['blueberry', 'blueberries'])

    expect(topic).toMatchObject({
      id: 'blueberry',
      label: 'Blueberry',
      confidence: 'high',
      isFallback: false,
    })
  })

  it('does not treat broad berry tags as strawberry', () => {
    const topic = resolveFoodTopic(['berries'])

    expect(topic.id).not.toBe('strawberry')
    expect(topic).toMatchObject({
      id: 'food',
      confidence: 'none',
      isFallback: true,
    })
  })
})
