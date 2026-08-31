import React, { forwardRef, HTMLAttributes, SVGAttributes } from 'react'
import classNames from 'classnames'

interface IconOwnProps {
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
   * Accessible name. When set, the icon is exposed to assistive tech instead of hidden.
   */
  title?: string
  /**
   * Path to the SVG sprite file. Ignored in `font` mode.
   */
  sprite?: string
}

export type IconProps =
  | (IconOwnProps & { font: true } & Omit<HTMLAttributes<HTMLSpanElement>, keyof IconOwnProps>)
  | (IconOwnProps & { font?: false } & Omit<SVGAttributes<SVGSVGElement>, keyof IconOwnProps>)

export const Icon = forwardRef<HTMLSpanElement | SVGSVGElement, IconProps>(
  (
    { name, className, size = 24, title, sprite = '/static/icons/chassis-icons.svg', ...props },
    ref
  ) => {
    const _className = classNames('icon', { [`cx-${name}`]: props.font }, className)

    if (props.font) {
      const { font: _, ...rest } = props
      return (
        <span
          className={_className}
          // A plain `<span>`'s implicit "generic" role doesn't support naming, so `aria-label`
          // alone is dropped by browsers/assistive tech - `role="img"` (matching the SVG path's
          // own implicit role) is what actually makes the accessible name stick.
          role={title ? 'img' : undefined}
          aria-hidden={title ? undefined : true}
          aria-label={title}
          ref={ref as React.Ref<HTMLSpanElement>}
          {...rest}
        />
      )
    }

    const { font: _, ...rest } = props

    return (
      <svg
        className={_className}
        width={size}
        height={size}
        role={title ? 'img' : undefined}
        aria-hidden={title ? undefined : true}
        ref={ref as React.Ref<SVGSVGElement>}
        {...rest}
      >
        {title && <title>{title}</title>}
        <use href={`${sprite}#${name}`} />
      </svg>
    )
  }
)

Icon.displayName = 'Icon'
