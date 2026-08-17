/**
 * Breakpoints
 */
export const BREAKPOINTS = ['small', 'medium', 'large', 'xlarge', '2xlarge']

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
export const SIZES = ['small', 'medium', 'large']

/**
 * Extended sizes
 */
export const EXTENDED_SIZES = ['2xsmall', 'xsmall', ...SIZES, 'xlarge', '2xlarge']

/**
 * Spacing values. `SPACING` is the runtime source of truth — `Spacing` is derived from it so the
 * two can't drift apart; anything needing the values at runtime (e.g. validating a string against
 * the scale) should import `SPACING`, not hand-copy the list.
 */
export const SPACING = [
  'zero',
  '4xsmall',
  '3xsmall',
  '2xsmall',
  'xsmall',
  'small',
  'medium',
  'large',
  'xlarge',
  '2xlarge',
  '3xlarge',
  '4xlarge',
  '5xlarge',
  '6xlarge'
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
export const FONT_SIZES = [
  '2xsmall',
  'xsmall',
  'small',
  'medium',
  'large',
  'xlarge',
  '2xlarge',
  '3xlarge',
  '4xlarge',
  '5xlarge'
]

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
