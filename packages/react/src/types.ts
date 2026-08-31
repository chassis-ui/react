/**
 * Breakpoints
 */
export type Breakpoint = 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'

/**
 * Context colors
 */
export type ContextColor =
  | 'default'
  | 'alternate'
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'black'
  | 'white'

/**
 * Context styles
 */
export type ContextStyle = 'basic' | 'solid' | 'outline' | 'smooth'

/**
 * Component sizes
 */
export type Sizing = 'small' | 'medium' | 'large'

/**
 * Extended sizes
 */
export type ExtendedSizing = '2xsmall' | 'xsmall' | Sizing | 'xlarge' | '2xlarge'

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
] as const

export type Spacing = (typeof SPACING)[number]

/**
 * Font families
 */
export type FontFamily = 'text' | 'display' | 'code' | 'html'

/**
 * Font weights
 */
export type FontWeight = 'elegant' | 'normal' | 'strong' | 'mass'

/**
 * Font sizes
 */
export type FontSize =
  | '2xsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | '2xlarge'
  | '3xlarge'
  | '4xlarge'
  | '5xlarge'

/**
 * Component placements
 */
export type Placements =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top-end'
  | 'top'
  | 'top-start'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'left-start'
  | 'left'
  | 'left-end'

/**
 * Component shapes
 */
export type Shapes =
  | 'rounded'
  | 'rounded-top'
  | 'rounded-end'
  | 'rounded-bottom'
  | 'rounded-start'
  | 'rounded-circle'
  | 'rounded-pill'
  | 'rounded-0'
  | 'rounded-1'
  | 'rounded-2'
  | 'rounded-3'

export type TextColor =
  | ContextColor
  | 'main'
  | 'subtle'
  | 'slight'
  | 'solid'
  | 'inverse'
  | 'highlight'
  | 'active'
  | 'contrast'

export type Triggers = 'hover' | 'focus' | 'click'
