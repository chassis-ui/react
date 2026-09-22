import React, { cloneElement, ReactElement } from 'react'
import { mergeProps } from 'react-aria'

import { Icon } from '../components/icon/Icon'
import { useIconConfig } from '../hooks/useIconConfig'
import { DEFAULT_ICONS, IconKey, IconValue } from './iconConfig'

// Every icon this library's own components draw goes through here, never through `<Icon>`
// directly, so a consumer can swap in their own icons (`IconProvider`'s `icons`/`component`, or a
// component's own icon prop). The rendering component passes the class names chassis-css hooks
// onto (`menu-item-check` positions the check, `navbar-toggler-icon` sizes and colors it,
// `carousel-icon-play`/`-pause` are toggled by state, `directional-icon` flips in RTL); those are
// merged onto whatever icon ends up rendered, so a custom icon lands in the same place a built-in
// one would. `aria-hidden` defaults on: each of these icons sits beside its own visible or
// visually-hidden label.
//
// A custom *element* deliberately doesn't get the `icon` class itself: chassis-css's `.icon` sets
// `fill`, which would paint over an outline icon set's `fill="none"` (Lucide, Heroicons outline,
// ...). It keeps its own size and color — `currentColor` icons still follow the control's text.
type IconRenderProps = { className?: string } & Record<string, unknown>

export function ResolvedIcon({ value, ...props }: IconRenderProps & { value: IconValue }) {
  const { component: Component } = useIconConfig()
  const iconProps = { 'aria-hidden': true, ...props }

  if (typeof value !== 'string') {
    const element = value as ReactElement<Record<string, unknown>>
    return cloneElement(element, mergeProps(iconProps, element.props))
  }
  if (Component) return <Component name={value} {...iconProps} />
  return <Icon name={value} {...iconProps} />
}

export function IconSlot({
  icon,
  override,
  ...props
}: IconRenderProps & { icon: IconKey; override?: IconValue }) {
  const { icons } = useIconConfig()
  return <ResolvedIcon value={override ?? icons?.[icon] ?? DEFAULT_ICONS[icon]} {...props} />
}
