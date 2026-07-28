import React, { forwardRef, HTMLAttributes, SVGAttributes } from 'react'
import classNames from 'classnames'

export interface CxIconProps extends HTMLAttributes<HTMLSpanElement | SVGSVGElement> {
  /**
   * Icon name, e.g. `folder-tree`. Matches a `cx-{name}` font glyph class or an id in the SVG sprite.
   */
  name: string
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Width/height (in px) applied to the SVG. Ignored in `font` mode.
   */
  size?: number
  /**
   * Render as a `cx-{name}` font glyph `<span>` instead of an SVG `<use>` reference.
   */
  font?: boolean
  /**
   * Accessible name. When set, the icon is exposed to assistive tech instead of hidden.
   */
  title?: string
  /**
   * Path to the SVG sprite file. Ignored in `font` mode.
   */
  sprite?: string
}

export const CxIcon = forwardRef<HTMLSpanElement | SVGSVGElement, CxIconProps>(
  (
    {
      name,
      className,
      size = 24,
      font = false,
      title,
      sprite = '/static/icons/chassis-icons.svg',
      ...rest
    },
    ref
  ) => {
    const _className = classNames('icon', { [`cx-${name}`]: font }, className)

    if (font) {
      return (
        <span
          className={_className}
          aria-hidden={title ? undefined : true}
          aria-label={title}
          ref={ref as React.Ref<HTMLSpanElement>}
          {...rest}
        />
      )
    }

    return (
      <svg
        className={_className}
        width={size}
        height={size}
        aria-hidden={title ? undefined : true}
        ref={ref as React.Ref<SVGSVGElement>}
        {...(rest as SVGAttributes<SVGSVGElement>)}
      >
        {title && <title>{title}</title>}
        <use href={`${sprite}#${name}`} />
      </svg>
    )
  }
)

CxIcon.displayName = 'CxIcon'
