import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { createPolymorphicComponent, PolymorphicRef } from '../../utils/polymorphic'
import { Link, LinkProps } from '../link/Link'

type CardLinkOwnProps = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export type CardLinkProps<C extends ElementType = 'a'> = LinkProps<C> & CardLinkOwnProps

type CardLinkComponent = (<C extends ElementType = 'a'>(
  props: CardLinkProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function CardLinkRender<C extends ElementType = 'a'>(
  { children, className, ...rest }: CardLinkProps<C>,
  ref: PolymorphicRef<C>
) {
  const _className = classNames('card-link', className)

  return (
    <Link
      className={_className}
      {...(rest as Record<string, unknown>)}
      ref={ref as PolymorphicRef<ElementType>}
    >
      {children}
    </Link>
  )
}

export const CardLink = createPolymorphicComponent<CardLinkComponent>(
  CardLinkRender as ForwardRefRenderFunction<Element, CardLinkProps<ElementType>>,
  'CardLink'
)
