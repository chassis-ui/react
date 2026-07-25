import React, { forwardRef, HTMLAttributes, useContext } from 'react'
import classNames from 'classnames'

import { CxAccordionContext } from './CxAccordion'

export interface CxAccordionItemProps extends HTMLAttributes<HTMLDetailsElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
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
  ({ children, className, open, itemKey: _itemKey, ...rest }, ref) => {
    const { alwaysOpen, name } = useContext(CxAccordionContext)

    const groupProps = alwaysOpen ? {} : { name }

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
  },
)

CxAccordionItem.displayName = 'CxAccordionItem'
