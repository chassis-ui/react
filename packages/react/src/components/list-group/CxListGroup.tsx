import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Colors, contextPropType } from '../Types'

export interface CListGroupItemDef {
  /**
   * Item label content.
   */
  label: React.ReactNode
  /**
   * Makes the item a link.
   */
  href?: string
  /**
   * Sets the context color of the item.
   */
  context?: Colors
  /**
   * Marks the item as active.
   */
  active?: boolean
  /**
   * Marks the item as disabled.
   */
  disabled?: boolean
}

export interface CListGroupProps extends HTMLAttributes<HTMLDivElement | HTMLUListElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Remove some borders and rounded corners to render list group items edge-to-edge in a parent component (e.g., `<CxCard>`).
   */
  flush?: boolean
  /**
   * Array of item definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: CListGroupItemDef[]
  /**
   * Specify a layout type.
   */
  layout?:
    | 'horizontal'
    | 'horizontal-small'
    | 'horizontal-medium'
    | 'horizontal-large'
    | 'horizontal-xlarge'
    | 'horizontal-2xlarge'
}

export const CxListGroup = forwardRef<HTMLDivElement | HTMLUListElement, CListGroupProps>(
  ({ children, className, component: Component = 'ul', flush, items, layout }, ref) => {
    const _className = classNames(
      'list-group',
      {
        'list-group-flush': flush,
        [`list-group-${layout}`]: layout,
      },
      className,
    )

    const autoContent = items
      ? items.map((item, idx) => {
          const itemClass = classNames(
            'list-item',
            item.context,
            {
              action: !!item.href,
              active: item.active,
              disabled: item.disabled,
            },
          )
          const Tag = item.href ? 'a' : 'li'
          return (
            <Tag
              key={idx}
              className={itemClass}
              {...(item.href ? { href: item.href } : {})}
              {...(item.active ? { 'aria-current': true } : {})}
              {...(item.disabled ? { 'aria-disabled': true } : {})}
            >
              {item.label}
            </Tag>
          )
        })
      : null

    return (
      <Component className={_className} ref={ref}>
        {autoContent ?? children}
      </Component>
    )
  },
)

CxListGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.elementType,
  flush: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      href: PropTypes.string,
      context: contextPropType,
      active: PropTypes.bool,
      disabled: PropTypes.bool,
    }) as PropTypes.Validator<CListGroupItemDef>,
  ),
  layout: PropTypes.oneOf([
    'horizontal',
    'horizontal-small',
    'horizontal-medium',
    'horizontal-large',
    'horizontal-xlarge',
    'horizontal-2xlarge',
  ]),
}

CxListGroup.displayName = 'CxListGroup'
