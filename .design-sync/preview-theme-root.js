/*
 * Theme root for design-sync previews.
 *
 * Chassis has no theme *provider* component — theming is an attribute on a host
 * element. `@chassis-ui/css` declares every token under `:root` with
 * `color-scheme: light dark` and `light-dark(...)` values, so with no
 * `data-cx-theme` in the tree a component follows the VIEWER's OS colour
 * preference. `[data-cx-theme="light"|"dark"]` pins `color-scheme`, and
 * `color-scheme` inherits — which is exactly what `.storybook/preview.tsx`'s
 * `withThemeByDataAttribute` decorator does (defaultTheme: 'light').
 *
 * The decorator itself can't be reused here: the converter stubs every
 * `@storybook/*` import, and the stub doesn't materialise
 * `withThemeByDataAttribute` as an own property, so the bundled decorator threw
 * `withThemeByDataAttribute is not a function` in all 22 previews. Declaring
 * this as `cfg.provider` skips decorator bundling entirely and reproduces the
 * one thing the decorator actually contributed.
 *
 * It is also honest guidance for the design agent: an app built with Chassis
 * needs the same attribute on its own root element. See conventions.md.
 */
import { createElement } from 'react'

export const ChassisThemeRoot = ({ theme = 'light', children }) =>
  createElement('div', { 'data-cx-theme': theme, className: 'cx-theme-root' }, children)

ChassisThemeRoot.displayName = 'ChassisThemeRoot'
