import React, { forwardRef, HTMLAttributes, ReactNode, useId } from 'react'
import classNames from 'classnames'

import { CxAccordionBody } from './CxAccordionBody'
import { CxAccordionHeader } from './CxAccordionHeader'
import { CxAccordionItem } from './CxAccordionItem'
import { CxAccordionContext } from './context'

export interface CxAccordionItemDef {
  /**
   * Let this item stay open when another item opens, overriding the accordion's `alwaysOpen` setting.
   */
  alwaysOpen?: boolean
  /**
   * Body content, rendered inside a `CxAccordionBody`.
   */
  body: ReactNode
  /**
   * A string of all className you want applied to this item.
   */
  className?: string
  /**
   * Header content, rendered inside a `CxAccordionHeader`.
   */
  header: ReactNode
  /**
   * React key for this item. Falls back to its index when omitted.
   */
  id?: number | string
  /**
   * The group this item shares with other items so only one can be open at a time, overriding the
   * accordion's shared `name`.
   */
  name?: string
  /**
   * Start the item in the open state.
   */
  open?: boolean
}

export interface CxAccordionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Make accordion items stay open when another item is opened.
   */
  alwaysOpen?: boolean
  /**
   * Move the caret icon to the end of the header.
   */
  caretEnd?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Removes the default background-context, some borders, and some rounded corners to render accordions edge-to-edge with their parent container.
   */
  flush?: boolean
  /**
   * Array of item definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: CxAccordionItemDef[]
  /**
   * The shared group name used by items that don't set their own `name`. Defaults to an auto-generated id.
   */
  name?: string
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
}

export const CxAccordion = forwardRef<HTMLDivElement, CxAccordionProps>(
  (
    { children, alwaysOpen = false, caretEnd, className, flush, items, name, size, ...rest },
    ref
  ) => {
    const generatedName = useId()
    const groupName = name ?? generatedName
    const _className = classNames('accordion', { flush, 'caret-end': caretEnd }, size, className)

    const content = items
      ? items.map((item, index) => (
          <CxAccordionItem
            key={item.id ?? index}
            className={item.className}
            open={item.open}
            name={item.name}
            alwaysOpen={item.alwaysOpen}
          >
            <CxAccordionHeader>{item.header}</CxAccordionHeader>
            <CxAccordionBody>{item.body}</CxAccordionBody>
          </CxAccordionItem>
        ))
      : children

    return (
      <div className={_className} {...rest} ref={ref}>
        <CxAccordionContext.Provider value={{ alwaysOpen, name: groupName }}>
          {content}
        </CxAccordionContext.Provider>
      </div>
    )
  }
)

CxAccordion.displayName = 'CxAccordion'
