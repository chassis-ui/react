import React, { forwardRef, HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

import { Breakpoint, ContextColor, ContextStyle, Sizing } from '../../types'
import { buildResponsiveClassNames } from '../../utils/breakpoints'
import { CardBody } from './CardBody'
import { CardFooter } from './CardFooter'
import { CardImage } from './CardImage'
import { CardSubtitle } from './CardSubtitle'
import { CardText } from './CardText'
import { CardTitle } from './CardTitle'

type CardDirection = 'row' | 'column'

const directionClassNames = (direction: CardDirection | undefined, prefix: string) => [
  direction && `${prefix}flex-${direction}`
]

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Switches the card from its default stacked (column) layout to a side-by-side (row) layout.
   * Wrap the image and body in `Col` to control each side's width.
   */
  direction?: CardDirection
  /**
   * Shorthand for a `CardFooter`, rendered after the image/title/subtitle/text/`children` block.
   */
  footer?: ReactNode
  /**
   * Shorthand for a `CardImage` — pass a `src`. Combine with `imageAlt`/`imageOrientation`. For
   * anything beyond a single top/bottom image cap (overlays, a horizontal layout, a custom
   * `component`), omit this and compose `CardImage` directly as a child instead.
   */
  image?: string
  /**
   * Accessible alt text for `image`. Ignored unless `image` is set.
   */
  imageAlt?: string
  /**
   * Orientates `image` to the top (default) or bottom of the card.
   */
  imageOrientation?: 'top' | 'bottom'
  /**
   * Overrides `direction` at one or more breakpoints — e.g. `{ large: 'row' }` to lay the card
   * out horizontally from `large` up while stacking below it.
   */
  responsive?: Partial<Record<Breakpoint, CardDirection>>
  /**
   * Sets the size of the component to one of Chassis component sizes.
   */
  size?: Sizing
  /**
   * Shorthand for a `CardSubtitle`, rendered directly after `title`.
   */
  subtitle?: ReactNode
  /**
   * Shorthand for a `CardText`, rendered after `title`/`subtitle`.
   */
  text?: ReactNode
  /**
   * Shorthand for a `CardTitle`. Set alongside `subtitle`/`text` (or plain `children`, e.g. a
   * `Button`) to build a standard card without composing `CardBody`/`CardTitle` yourself — all
   * render together inside a single `CardBody`, in that order. Only takes effect when at least
   * one of `image`/`title`/`subtitle`/`text`/`footer` is set; otherwise `children` render as-is,
   * so full manual composition (`CardHeader`, lists, overlays, nav headers, …) keeps working
   * unchanged. Mixing shorthand props with a manually-composed `children` tree isn't supported —
   * pick one approach per card.
   */
  title?: ReactNode
  /**
   * Sets the context style of the component. `basic` (the default) renders with no extra class.
   */
  variant?: ContextStyle
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      color,
      direction,
      footer,
      image,
      imageAlt,
      imageOrientation = 'top',
      responsive,
      size,
      subtitle,
      text,
      title,
      variant,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      'card',
      color,
      {
        context: !!color,
        solid: variant === 'solid',
        smooth: variant === 'smooth',
        outline: variant === 'outline',
        small: size === 'small',
        large: size === 'large'
      },
      buildResponsiveClassNames(directionClassNames, direction, responsive),
      className
    )

    const hasShorthand =
      image != null || title != null || subtitle != null || footer != null || text != null
    const hasBodyContent = title != null || subtitle != null || text != null || children != null

    return (
      <div className={_className} {...rest} ref={ref}>
        {hasShorthand ? (
          <>
            {image != null && imageOrientation === 'top' && (
              <CardImage orientation="top" src={image} alt={imageAlt ?? ''} />
            )}
            {hasBodyContent && (
              <CardBody>
                {title != null && <CardTitle>{title}</CardTitle>}
                {subtitle != null && <CardSubtitle>{subtitle}</CardSubtitle>}
                {text != null && <CardText>{text}</CardText>}
                {children}
              </CardBody>
            )}
            {image != null && imageOrientation === 'bottom' && (
              <CardImage orientation="bottom" src={image} alt={imageAlt ?? ''} />
            )}
            {footer != null && <CardFooter>{footer}</CardFooter>}
          </>
        ) : (
          children
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'
