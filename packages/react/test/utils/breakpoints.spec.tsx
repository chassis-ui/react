import { BREAKPOINT_NAME, SHORT_BREAKPOINTS } from '../../src/utils/breakpoints'

describe('breakpoints', () => {
  test('SHORT_BREAKPOINTS is ascending, mobile-first', () => {
    expect(SHORT_BREAKPOINTS).toEqual(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'])
  })

  test('BREAKPOINT_NAME maps every short key to its chassis-css breakpoint name', () => {
    expect(BREAKPOINT_NAME).toEqual({
      xs: '',
      sm: 'small',
      md: 'medium',
      lg: 'large',
      xl: 'xlarge',
      xxl: '2xlarge'
    })
  })

  test('every short breakpoint has an entry in BREAKPOINT_NAME', () => {
    SHORT_BREAKPOINTS.forEach((bp) => {
      expect(BREAKPOINT_NAME).toHaveProperty(bp)
    })
  })
})
