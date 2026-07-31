import React, {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  forwardRef,
  HTMLAttributes
} from 'react'
import classNames from 'classnames'

export interface CxInputAdornProps
  extends
    HTMLAttributes<HTMLElement>,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'rel' | 'target'>,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component. Use
   * `"button"` or `"a"` for an actionable adorn, e.g. a password reveal toggle or a clear button.
   */
  component?: string | ElementType
}

export const CxInputAdorn = forwardRef<HTMLElement, CxInputAdornProps>(
  ({ children, className, component: Component = 'span', onMouseDown, ...rest }, ref) => {
    const _className = classNames('input-adorn', className)
    const handleMouseDown: HTMLAttributes<HTMLElement>['onMouseDown'] = (event) => {
      onMouseDown?.(event)
      // Keep focus on the associated input (e.g. a password toggle) instead of
      // letting the browser shift it to this button/anchor on mousedown.
      if (!event.defaultPrevented) {
        event.preventDefault()
      }
    }
    return (
      <Component className={_className} onMouseDown={handleMouseDown} {...rest} ref={ref}>
        {children}
      </Component>
    )
  }
)

CxInputAdorn.displayName = 'CxInputAdorn'
