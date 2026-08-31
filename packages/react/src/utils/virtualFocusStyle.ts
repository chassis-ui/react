import { CSSProperties } from 'react'

// Options in a virtually-focused listbox (react-aria's combobox/listbox patterns) never receive
// real DOM focus — focus stays on the trigger (a text input or button) while the highlighted
// option is tracked virtually, so `:hover`/`:focus-visible` can't style it. To indicate the
// highlight without touching chassis-css, we reuse its own hover color tokens (already defined
// on the ancestor `.menu`, prefixed `--cx-` by chassis-css's build) as inline overrides instead
// of relying on `.active`, which chassis-css reserves for the pressed/`:active` look.
export const virtualFocusStyle: CSSProperties = {
  '--cx-icon-color': 'var(--cx-item-hover-icon-color)',
  '--cx-item-fg-color': 'var(--cx-item-hover-fg-color)',
  '--cx-item-bg-color': 'var(--cx-item-hover-bg-color)'
} as CSSProperties

export const getVirtualFocusStyle = (isFocused: boolean): CSSProperties | undefined =>
  isFocused ? virtualFocusStyle : undefined
