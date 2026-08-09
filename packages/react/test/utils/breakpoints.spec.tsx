import { BREAKPOINTS, buildResponsiveClassNames } from '../../src/utils/breakpoints'

describe('breakpoints', () => {
  test('BREAKPOINTS is the ascending, mobile-first list of full breakpoint names', () => {
    expect(BREAKPOINTS).toEqual(['small', 'medium', 'large', 'xlarge', '2xlarge'])
  })
})

describe('buildResponsiveClassNames', () => {
  type Layout = { value?: string }
  const toClassNames = ({ value }: Layout, prefix: string) => [value ? `${prefix}${value}` : null]

  test('maps the base layout at an empty prefix when no responsive overrides are given', () => {
    expect(buildResponsiveClassNames(toClassNames, { value: 'base' })).toEqual(['base'])
  })

  test('appends responsive overrides in ascending breakpoint order', () => {
    expect(
      buildResponsiveClassNames(
        toClassNames,
        { value: 'base' },
        { large: { value: 'lg' }, small: { value: 'sm' } }
      )
    ).toEqual(['base', 'small:sm', 'large:lg'])
  })

  test('skips breakpoints absent from the responsive object', () => {
    expect(
      buildResponsiveClassNames(toClassNames, { value: 'base' }, { medium: { value: 'md' } })
    ).toEqual(['base', 'medium:md'])
  })

  test('still calls toClassNames for the base layout even when it produces no class', () => {
    expect(buildResponsiveClassNames(toClassNames, {}, { small: { value: 'sm' } })).toEqual([
      null,
      'small:sm'
    ])
  })
})
