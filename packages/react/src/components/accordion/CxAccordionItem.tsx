import React, { forwardRef, HTMLAttributes, useContext } from 'react'
import classNames from 'classnames'

import { CxAccordionContext } from './context'

export interface CxAccordionItemProps extends HTMLAttributes<HTMLDetailsElement> {
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

export const CxAccordionItem = forwardRef<HTMLDetailsElement, CxAccordionItemProps>(
  ({ children, alwaysOpen, className, name, open, itemKey: _itemKey, ...rest }, ref) => {
    const context = useContext(CxAccordionContext)
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

CxAccordionItem.displayName = 'CxAccordionItem'
