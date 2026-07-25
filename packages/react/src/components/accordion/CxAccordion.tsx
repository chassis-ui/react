import React, { createContext, forwardRef, HTMLAttributes, useId } from 'react'
import classNames from 'classnames'

export interface CxAccordionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Make accordion items stay open when another item is opened.
   */
  alwaysOpen?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Removes the default background-context, some borders, and some rounded corners to render accordions edge-to-edge with their parent container.
   */
  flush?: boolean
}

export interface CxAccordionContextProps {
  alwaysOpen?: boolean
  name: string
}

export const CAccordionContext = createContext({} as CxAccordionContextProps)

export const CxAccordion = forwardRef<HTMLDivElement, CxAccordionProps>(
  ({ children, alwaysOpen = false, className, flush, ...rest }, ref) => {
    const name = useId()
    const _className = classNames('accordion', { 'accordion-flush': flush }, className)
    return (
      <div className={_className} {...rest} ref={ref}>
        <CAccordionContext.Provider value={{ alwaysOpen, name }}>
          {children}
        </CAccordionContext.Provider>
      </div>
    )
  },
)

CxAccordion.displayName = 'CxAccordion'
