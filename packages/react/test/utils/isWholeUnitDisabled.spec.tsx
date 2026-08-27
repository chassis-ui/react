import { CalendarDate } from '@internationalized/date'
import { CalendarState } from 'react-stately'

import { isWholeUnitDisabled } from '../../src/utils/isWholeUnitDisabled'

const baseState = (overrides: Partial<CalendarState<'single'>>) =>
  ({
    isDisabled: false,
    maxValue: null,
    minValue: null,
    ...overrides
  }) as unknown as CalendarState<'single'>

describe('isWholeUnitDisabled', () => {
  test('returns true when the whole calendar is disabled', () => {
    const state = baseState({ isDisabled: true })
    expect(
      isWholeUnitDisabled(state, new CalendarDate(2024, 1, 1), new CalendarDate(2024, 1, 31))
    ).toBe(true)
  })

  test('returns true when the unit starts entirely after maxValue', () => {
    const state = baseState({ maxValue: new CalendarDate(2024, 3, 15) })
    expect(
      isWholeUnitDisabled(state, new CalendarDate(2024, 4, 1), new CalendarDate(2024, 4, 30))
    ).toBe(true)
  })

  test('stays enabled when the unit only partly exceeds maxValue', () => {
    const state = baseState({ maxValue: new CalendarDate(2024, 3, 15) })
    expect(
      isWholeUnitDisabled(state, new CalendarDate(2024, 3, 1), new CalendarDate(2024, 3, 31))
    ).toBe(false)
  })

  test('returns true when the unit ends entirely before minValue', () => {
    const state = baseState({ minValue: new CalendarDate(2024, 3, 15) })
    expect(
      isWholeUnitDisabled(state, new CalendarDate(2024, 2, 1), new CalendarDate(2024, 2, 29))
    ).toBe(true)
  })

  test('stays enabled when the unit only partly precedes minValue', () => {
    const state = baseState({ minValue: new CalendarDate(2024, 3, 15) })
    expect(
      isWholeUnitDisabled(state, new CalendarDate(2024, 3, 1), new CalendarDate(2024, 3, 31))
    ).toBe(false)
  })

  test('returns false when no bounds apply', () => {
    const state = baseState({})
    expect(
      isWholeUnitDisabled(state, new CalendarDate(2024, 3, 1), new CalendarDate(2024, 3, 31))
    ).toBe(false)
  })
})
