import {
  baseValue,
  BREAKPOINTS,
  GRID_BREAKPOINTS,
  responsiveClassNames,
  responsiveProp
} from '../../src/utils/breakpoints'

describe('breakpoints', () => {
  test('BREAKPOINTS is the ascending, mobile-first list of full breakpoint names', () => {
    expect(BREAKPOINTS).toEqual(['sm', 'md', 'lg', 'xl', '2xl'])
  })
})

const toClassName = (value: string | number, prefix: string) => `${prefix}${value}`

describe('responsiveProp', () => {
  test('reads a plain value at the base only', () => {
    const prop = responsiveProp('a', toClassName)
    expect(prop('base')).toBe('a')
    expect(prop('md')).toBeNull()
  })

  test('reads an object at each of its keys, with the key as the prefix', () => {
    const prop = responsiveProp({ base: 'a', md: 'b' }, toClassName)
    expect(prop('base')).toBe('a')
    expect(prop('md')).toBe('md:b')
    expect(prop('lg')).toBeNull()
  })

  test('keeps a zero, which is a value', () => {
    expect(responsiveProp(0, toClassName)('base')).toBe('0')
    expect(responsiveProp({ md: 0 }, toClassName)('md')).toBe('md:0')
  })

  test('has no class for an unset prop', () => {
    expect(responsiveProp<string>(undefined, toClassName)('base')).toBeNull()
  })
})

describe('responsiveClassNames', () => {
  test('puts the base of every prop first, then each breakpoint in ascending order', () => {
    expect(
      responsiveClassNames([
        responsiveProp({ lg: 'a-lg', base: 'a', sm: 'a-sm' }, toClassName),
        responsiveProp({ sm: 'b-sm', base: 'b' }, toClassName)
      ]).filter(Boolean)
    ).toEqual(['a', 'b', 'sm:a-sm', 'sm:b-sm', 'lg:a-lg'])
  })

  test('reads the viewport breakpoints only, unless given the container keys', () => {
    const props = [responsiveProp({ '@md': 'c', md: 'v' }, toClassName)]
    expect(responsiveClassNames(props).filter(Boolean)).toEqual(['md:v'])
    expect(responsiveClassNames(props, GRID_BREAKPOINTS).filter(Boolean)).toEqual(['md:v', '@md:c'])
  })
})

describe('baseValue', () => {
  test('is the plain value, or the base of an object', () => {
    expect(baseValue('a')).toBe('a')
    expect(baseValue({ base: 'a', md: 'b' })).toBe('a')
    expect(baseValue({ md: 'b' })).toBeUndefined()
    expect(baseValue(undefined)).toBeUndefined()
  })
})
