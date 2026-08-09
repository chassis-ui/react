import { Breakpoint } from '../types'

// Short, JSX-attribute-safe breakpoint keys (Bootstrap-derived shorthand) used as prop names by
// `Row`/`Col`/`Container`, mapped to the real chassis-css breakpoint name used as a class prefix.
// `Breakpoint`'s `'2xlarge'` can't be used as a literal JSX prop name (invalid JSX identifier),
// which is why this shorthand exists as public API instead of the literal breakpoint strings.
export type ShortBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

// Mobile-first ascending order.
export const SHORT_BREAKPOINTS: ShortBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

// '' for `xs`: the base/unprefixed breakpoint has no chassis-css class prefix.
export const BREAKPOINT_NAME: Record<ShortBreakpoint, Breakpoint | ''> = {
  xs: '',
  sm: 'small',
  md: 'medium',
  lg: 'large',
  xl: 'xlarge',
  xxl: '2xlarge'
}

// Ascending, mobile-first, derived from BREAKPOINT_NAME rather than hand-typed so it can't drift.
// For components (e.g. `Stack`) that take `Breakpoint`'s literal names directly as prop values,
// unlike Row/Col/Container's short-key shorthand above.
export const BREAKPOINTS: Breakpoint[] = SHORT_BREAKPOINTS.map((bp) => BREAKPOINT_NAME[bp]).filter(
  (name): name is Breakpoint => name !== ''
)
