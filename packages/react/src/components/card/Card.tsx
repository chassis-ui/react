import React, { ElementType, ForwardRefRenderFunction, ReactElement, ReactNode } from 'react'
import classNames from 'classnames'

import { Breakpoint, ContextColor, ContextStyle, Sizing } from '../../types'
import {
  buildResponsiveClassNames,
  flexDirectionClassNames,
  FlexDirection
} from '../../utils/breakpoints'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { CardBody } from './CardBody'
import { CardFooter } from './CardFooter'
import { CardImage } from './CardImage'
import { CardSubtitle } from './CardSubtitle'
import { CardText } from './CardText'
import { CardTitle } from './CardTitle'

type CardOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Switches the card from its default stacked (column) layout to a side-by-side (row) layout.
   * Wrap the image and body in `Col` to control each side's width.
   */
  direction?: FlexDirection
  /**
   * Shorthand for a `CardFooter`, rendered after the image/title/subtitle/text/`children` block.
   */
  footer?: ReactNode
  /**
   * Shorthand for a `CardImage` — pass either a `src` URL (combine with `imageAlt`/
   * `imageOrientation`) or a fully-formed element — a `<CardImage>`, `<Skeleton>`,
   * `<Placeholder>`, or anything else — rendered as-is in its place. `imageAlt`/`imageOrientation`
   * only apply to the `src` form; set them directly on your own element otherwise. For a
   * horizontal layout or an overlay, omit this and compose `CardImage` directly as a child
   * instead.
   */
  image?: ReactNode
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
  responsive?: Partial<Record<Breakpoint, FlexDirection>>
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

export type CardProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CardOwnProps<C>>

type CardComponent = (<C extends ElementType = 'div'>(
  props: CardProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function CardRender<C extends ElementType = 'div'>(
  {
    children,
    className,
    color,
    component,
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
  }: CardProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
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
    buildResponsiveClassNames(flexDirectionClassNames, direction, responsive),
    className
  )

  const hasShorthand =
    image != null || title != null || subtitle != null || footer != null || text != null
  const hasBodyContent = title != null || subtitle != null || text != null || children != null
  const renderedImage =
    typeof image === 'string' ? (
      <CardImage orientation={imageOrientation} src={image} alt={imageAlt ?? ''} />
    ) : (
      image
    )

  return (
    <Component className={_className} {...rest} ref={ref}>
      {hasShorthand ? (
        <>
          {image != null && imageOrientation === 'top' && renderedImage}
          {hasBodyContent && (
            <CardBody>
              {title != null && <CardTitle>{title}</CardTitle>}
              {subtitle != null && <CardSubtitle>{subtitle}</CardSubtitle>}
              {text != null && <CardText>{text}</CardText>}
              {children}
            </CardBody>
          )}
          {image != null && imageOrientation === 'bottom' && renderedImage}
          {footer != null && <CardFooter>{footer}</CardFooter>}
        </>
      ) : (
        children
      )}
    </Component>
  )
}

export const Card = createPolymorphicComponent<CardComponent>(
  CardRender as ForwardRefRenderFunction<Element, CardProps<ElementType>>,
  'Card'
)
