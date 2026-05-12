import React, { forwardRef, HTMLAttributes, useContext } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CAccordionContext } from './CxAccordion'

export interface CAccordionItemProps extends HTMLAttributes<HTMLDetailsElement> {
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

export const CxAccordionItem = forwardRef<HTMLDetailsElement, CAccordionItemProps>(
  ({ children, className, open, itemKey: _itemKey, ...rest }, ref) => {
    const { alwaysOpen, name } = useContext(CAccordionContext)

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

CxAccordionItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  open: PropTypes.bool,
  itemKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

CxAccordionItem.displayName = 'CxAccordionItem'
