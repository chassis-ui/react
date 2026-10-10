import { ContextColor } from '../types'

// The class of a context color, per family, as whole names: never `bg-${color}`.
//
// In the Tailwind entry of chassis-css these are utilities, generated only where Tailwind's
// scanner finds the full class name in a source file, and it cannot read a name joined at
// runtime: the class would have no rule, with no warning. A whole name in `dist` is found once a
// project registers the package with `@source`. `test/utils/tailwindClassNames.spec.tsx` fails on
// a utility name built from parts anywhere in `src/`.
//
// `Record<ContextColor, string>` fails the type check when a color joins the type and not a table.

export const BG_COLOR_CLASS_NAMES: Record<ContextColor, string> = {
  default: 'bg-default',
  alternate: 'bg-alternate',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  neutral: 'bg-neutral',
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-info',
  black: 'bg-black',
  white: 'bg-white'
}

// A spinner draws from `--cx-spinner-color`, which only `spinner-{color}` sets: `fg-{color}`
// changes `color`, and the ring and the dot don't read it.
export const SPINNER_COLOR_CLASS_NAMES: Record<ContextColor, string> = {
  default: 'spinner-default',
  alternate: 'spinner-alternate',
  primary: 'spinner-primary',
  secondary: 'spinner-secondary',
  neutral: 'spinner-neutral',
  success: 'spinner-success',
  danger: 'spinner-danger',
  warning: 'spinner-warning',
  info: 'spinner-info',
  black: 'spinner-black',
  white: 'spinner-white'
}

export const ICON_COLOR_CLASS_NAMES: Record<ContextColor, string> = {
  default: 'icon-default',
  alternate: 'icon-alternate',
  primary: 'icon-primary',
  secondary: 'icon-secondary',
  neutral: 'icon-neutral',
  success: 'icon-success',
  danger: 'icon-danger',
  warning: 'icon-warning',
  info: 'icon-info',
  black: 'icon-black',
  white: 'icon-white'
}

export const LINK_COLOR_CLASS_NAMES: Record<ContextColor, string> = {
  default: 'link-default',
  alternate: 'link-alternate',
  primary: 'link-primary',
  secondary: 'link-secondary',
  neutral: 'link-neutral',
  success: 'link-success',
  danger: 'link-danger',
  warning: 'link-warning',
  info: 'link-info',
  black: 'link-black',
  white: 'link-white'
}
