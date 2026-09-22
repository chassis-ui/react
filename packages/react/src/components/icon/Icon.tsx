import React, { CSSProperties, forwardRef, HTMLAttributes, SVGAttributes } from 'react'
import classNames from 'classnames'

import { useIconConfig } from '../../hooks/useIconConfig'
import { DEFAULT_FONT_PREFIX } from '../../utils/iconConfig'

interface IconOwnProps {
  /**
   * Icon name, e.g. `folder-tree`. Matches an id in the SVG sprite, or a `cx-{name}` font glyph
   * class in `font` mode (see `IconProvider`'s `fontPrefix`).
   */
  name: string
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Icon size: a number of pixels, or any CSS length (`'1.25rem'`, `'1em'`). Sets chassis-css's
   * `--cx-icon-size` on the icon, so it applies in `font` mode too. Leave unset to keep the size
   * chassis-css gives icons in context (inside a button, an input, a navbar toggler, ...).
   */
  size?: number | string
  /**
   * Accessible name. When set, the icon is exposed to assistive tech instead of hidden.
   */
  title?: string
  /**
   * URL of the SVG sprite file. Defaults to `IconProvider`'s `sprite`, or to none — a sprite
   * embedded in the page, referenced as `#name`. Ignored in `font` mode.
   */
  sprite?: string
}

export type IconProps =
  | (IconOwnProps & { font: true } & Omit<HTMLAttributes<HTMLSpanElement>, keyof IconOwnProps>)
  | (IconOwnProps & { font?: false } & Omit<SVGAttributes<SVGSVGElement>, keyof IconOwnProps>)

// An SVG's `width`/`height` attributes lose to chassis-css's `.icon { width: var(--cx-icon-size) }`
// — `size` used to set only those, so `size={48}` rendered at the stylesheet's 24px whenever
// chassis-css was loaded. The custom property is what actually sizes an icon; the attributes stay
// as the fallback for a page without chassis-css, where an unsized `<svg>` would render 300×150.
const FALLBACK_SIZE = 24

export const Icon = forwardRef<HTMLSpanElement | SVGSVGElement, IconProps>((props, ref) => {
  const config = useIconConfig()
  const {
    name,
    className,
    font = config.font ?? false,
    size,
    sprite = config.sprite ?? '',
    style,
    title,
    ...rest
  } = props as IconOwnProps & { font?: boolean; style?: CSSProperties }

  const sizeStyle =
    size == null
      ? style
      : ({
          '--cx-icon-size': typeof size === 'number' ? `${size}px` : size,
          ...style
        } as CSSProperties)
  const _className = classNames(
    'icon',
    { [`${config.fontPrefix ?? DEFAULT_FONT_PREFIX}${name}`]: font },
    config.className,
    className
  )

  if (font) {
    return (
      <span
        className={_className}
        // A plain `<span>`'s implicit "generic" role doesn't support naming, so `aria-label`
        // alone is dropped by browsers/assistive tech - `role="img"` (matching the SVG path's
        // own implicit role) is what actually makes the accessible name stick.
        role={title ? 'img' : undefined}
        aria-hidden={title ? undefined : true}
        aria-label={title}
        style={sizeStyle}
        ref={ref as React.Ref<HTMLSpanElement>}
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
      />
    )
  }

  return (
    <svg
      className={_className}
      width={size ?? FALLBACK_SIZE}
      height={size ?? FALLBACK_SIZE}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      style={sizeStyle}
      ref={ref as React.Ref<SVGSVGElement>}
      {...(rest as SVGAttributes<SVGSVGElement>)}
    >
      {title && <title>{title}</title>}
      <use href={`${sprite}#${name}`} />
    </svg>
  )
})

Icon.displayName = 'Icon'
