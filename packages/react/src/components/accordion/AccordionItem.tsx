import React, { forwardRef, DetailsHTMLAttributes, useContext } from 'react'
import classNames from 'classnames'

import { AccordionContext } from './context'

export interface AccordionItemProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  /**
   * Let this item stay open when another item opens, overriding the accordion's `alwaysOpen` setting.
   */
  alwaysOpen?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The group this item shares with other items so only one can be open at a time, overriding the
   * accordion's shared `name`.
   */
  name?: string
  /**
   * Start the item in the open state.
   */
  open?: boolean
  /**
   * @deprecated No longer used. The native details element manages its own state.
   */
  itemKey?: number | string
}

export const AccordionItem = forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ children, alwaysOpen, className, name, open, itemKey: _itemKey, ...rest }, ref) => {
    if (_itemKey !== undefined) {
      console.warn(
        'AccordionItem: the itemKey prop is deprecated and no longer used — the native ' +
          '<details> element manages its own state. It will be removed in a future major version.'
      )
    }

    const context = useContext(AccordionContext)
    const isAlwaysOpen = alwaysOpen ?? context.alwaysOpen
    const groupName = name ?? context.name

    const groupProps = isAlwaysOpen ? {} : { name: groupName }

    return (
      <details
        className={classNames('accordion-item', className)}
        open={open}
        {...(groupProps as React.HTMLAttributes<HTMLDetailsElement>)}
        {...rest}
        ref={ref}
      >
        {children}
      </details>
    )
  }
)

AccordionItem.displayName = 'AccordionItem'
