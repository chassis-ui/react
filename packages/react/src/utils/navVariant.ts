import { devWarning } from './devWarning'

// The looks of a `.nav` that `Nav` and `TabList` share. `'pills'` is what `'segments'` was called
// until chassis-css 0.6 renamed `.nav-pills` to `.nav-segments`: still accepted, deprecated.
export type NavVariant = 'tabs' | 'segments' | 'underline' | 'pills'

export function navVariantClassName(
  variant: NavVariant | undefined,
  displayName: string
): string | undefined {
  devWarning(
    variant === 'pills',
    `${displayName}: variant="pills" is deprecated, use variant="segments" instead. It will be ` +
      'removed in a future major version.'
  )

  return variant && `nav-${variant === 'pills' ? 'segments' : variant}`
}
