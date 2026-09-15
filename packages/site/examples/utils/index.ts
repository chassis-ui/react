/**
 * Breakpoints
 */
export const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl']

/**
 * Context colors
 */
export const COLORS = [
  'default',
  'alternate',
  'primary',
  'secondary',
  'neutral',
  'success',
  'danger',
  'warning',
  'info',
  'black',
  'white'
] as const

/**
 * Context styles
 */
export const VARIANTS = ['basic', 'solid', 'outline', 'smooth']

/**
 * Component sizes
 */
export const SIZES = ['sm', 'md', 'lg']

/**
 * Extended sizes
 */
export const EXTENDED_SIZES = ['2xs', 'xs', ...SIZES, 'xl', '2xl']

/**
 * Spacing values. `SPACING` is the runtime source of truth — `Spacing` is derived from it so the
 * two can't drift apart; anything needing the values at runtime (e.g. validating a string against
 * the scale) should import `SPACING`, not hand-copy the list.
 */
export const SPACING = [
  'zero',
  '4xs',
  '3xs',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl'
]

/**
 * Font families
 */
export const FONT_FAMILIES = ['text', 'display', 'code', 'html']

/**
 * Font weights
 */
export type FONT_WEIGHTS = ['elegant', 'normal', 'strong', 'mass']

/**
 * Font sizes
 */
export const FONT_SIZES = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']

/**
 * Component placements
 */
export const PLACEMENTS = [
  'auto',
  'auto-start',
  'auto-end',
  'top-end',
  'top',
  'top-start',
  'bottom-end',
  'bottom',
  'bottom-start',
  'right-start',
  'right',
  'right-end',
  'left-start',
  'left',
  'left-end'
]

/**
 * Component shapes
 */
export const SHAPES = [
  'rounded',
  'rounded-top',
  'rounded-end',
  'rounded-bottom',
  'rounded-start',
  'rounded-circle',
  'rounded-pill',
  'rounded-0',
  'rounded-1',
  'rounded-2',
  'rounded-3'
]

export const TextColors = [
  ...COLORS,
  'main',
  'subtle',
  'slight',
  'solid',
  'inverse',
  'highlight',
  'active',
  'contrast'
].map((color) => `fg-${color}`)
