import React, {
  createContext,
  ElementType,
  forwardRef,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react'
import classNames from 'classnames'
import { Manager } from 'react-popper'

import { Placements } from '../Types'
import { useForkedRef } from '../../utils/hooks'

export type Directions = 'start' | 'end'

export type Breakpoints =
  | { xs: Directions }
  | { small: Directions }
  | { medium: Directions }
  | { large: Directions }
  | { xlarge: Directions }
  | { '2xlarge': Directions }

export type Alignments = Directions | Breakpoints

export interface CDropdownProps extends HTMLAttributes<HTMLDivElement | HTMLLIElement> {
  /**
   * Set aligment of dropdown menu.
   *
   * @type 'start' | 'end' | { xs: 'start' | 'end' } | { small: 'start' | 'end' } | { medium: 'start' | 'end' } | { large: 'start' | 'end' } | { xlarge: 'start' | 'end'} | { '2xlarge': 'start' | 'end'}
   */
  alignment?: Alignments
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Sets a darker context scheme to match a dark navbar.
   */
  dark?: boolean
  /**
   * Sets a specified  direction and location of the dropdown menu.
   *
   * @type 'dropup' | 'dropend' | 'dropstart'
   */
  direction?: 'dropup' | 'dropend' | 'dropstart'
  /**
   * Callback fired when the component requests to be hidden.
   */
  onHide?: () => void
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void
  /**
   * Describes the placement of your component after Popper.js has applied all the modifiers that may have flipped or altered the originally provided placement property.
   *
   * @type 'auto' | 'top-end' | 'top' | 'top-start' | 'bottom-end' | 'bottom' | 'bottom-start' | 'right-start' | 'right' | 'right-end' | 'left-start' | 'left' | 'left-end'
   */
  placement?: Placements
  /**
   * If you want to disable dynamic positioning set this property to `true`.
   */
  popper?: boolean
  /**
   * Set the dropdown variant to an btn-group, dropdown, input-group, and nav-item.
   */
  variant?: 'btn-group' | 'dropdown' | 'input-group' | 'nav-item'
  /**
   * Toggle the visibility of dropdown menu component.
   */
  visible?: boolean
}

interface ContextProps extends CDropdownProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export const CDropdownContext = createContext({} as ContextProps)

export const CxDropdown = forwardRef<HTMLDivElement | HTMLLIElement, CDropdownProps>(
  (
    {
      children,
      alignment,
      className,
      dark,
      direction,
      onHide,
      onShow,
      placement = 'bottom-start',
      popper = true,
      variant = 'btn-group',
      component = 'div',
      visible = false,
      ...rest
    },
    ref,
  ) => {
    const [_visible, setVisible] = useState(visible)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, dropdownRef)

    const Component = variant === 'nav-item' ? 'li' : component

    // Disable popper when a responsive alignment object is supplied.
    const effectivePopper = typeof alignment === 'object' ? false : popper

    const contextValues = {
      alignment,
      dark,
      direction: direction,
      placement: placement,
      popper: effectivePopper,
      variant,
      visible: _visible,
      setVisible,
    }

    const _className = classNames(
      variant === 'nav-item' ? 'nav-item dropdown' : variant,
      {
        show: _visible,
      },
      direction,
      className,
    )

    useEffect(() => {
      if (!_visible) return

      const handleDismiss = (event: Event) => {
        if (!dropdownRef.current?.contains(event.target as HTMLElement)) {
          setVisible(false)
        }
      }

      // Defer attaching listeners so the toggle's own click doesn't immediately close the menu.
      const id = setTimeout(() => {
        window.addEventListener('click', handleDismiss)
        window.addEventListener('keyup', handleDismiss)
      })

      return () => {
        clearTimeout(id)
        window.removeEventListener('click', handleDismiss)
        window.removeEventListener('keyup', handleDismiss)
      }
    }, [_visible])

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    useEffect(() => {
      if (_visible) {
        onShow && onShow()
      } else {
        onHide && onHide()
      }
    }, [_visible])

    const dropdownContent = () => {
      return variant === 'input-group' ? (
        <>{children}</>
      ) : (
        <Component className={_className} {...rest} ref={forkedRef}>
          {children}
        </Component>
      )
    }

    return effectivePopper ? (
      <CDropdownContext.Provider value={contextValues}>
        <Manager>{dropdownContent()}</Manager>
      </CDropdownContext.Provider>
    ) : (
      <CDropdownContext.Provider value={contextValues}>
        {dropdownContent()}
      </CDropdownContext.Provider>
    )
  },
)

CxDropdown.displayName = 'CxDropdown'
