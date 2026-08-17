import { consumePointerClick, markPointerClick } from '../../src/utils/pointerInteraction'

describe('pointerInteraction', () => {
  test('consumePointerClick reports true for a marked element, then clears the mark', () => {
    const el = document.createElement('button')
    markPointerClick(el)

    expect(consumePointerClick(el)).toBe(true)
    expect(consumePointerClick(el)).toBe(false)
  })

  test('consumePointerClick reports false for an element that was never marked', () => {
    const el = document.createElement('button')
    expect(consumePointerClick(el)).toBe(false)
  })

  test('consumePointerClick reports false for null', () => {
    expect(consumePointerClick(null)).toBe(false)
  })
})
