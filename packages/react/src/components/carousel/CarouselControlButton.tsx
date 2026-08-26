import React, { ButtonHTMLAttributes, forwardRef, useEffect, useRef } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import { markPointerClick } from '../../utils/pointerInteraction'
import { Icon } from '../icon'
import { useCarouselContext } from './context'

interface CarouselControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Which direction this control navigates, and which end-of-track state disables it.
   */
  direction: 'prev' | 'next'
  /**
   * The accessible label announced by assistive technology.
   */
  label?: string
}

// Shared prev/next control, used by both CarouselControlPrev and CarouselControlNext — mirrors
// how CalendarNavButton.tsx factors the same shape for Calendar/RangeCalendar.
export const CarouselControlButton = forwardRef<HTMLButtonElement, CarouselControlButtonProps>(
  ({ children, className, direction, disabled, label, onClick, ...rest }, ref) => {
    const { atEnd, atStart, ends, next, prev, registerControl } = useCarouselContext()
    const buttonRef = useRef<HTMLButtonElement>(null)
    const forkedRef = useForkedRef(ref, buttonRef)

    useEffect(() => {
      const element = buttonRef.current
      if (!element) return undefined
      return registerControl(direction, element)
    }, [registerControl, direction])

    const atBoundary = direction === 'next' ? atEnd : atStart
    const navigate = direction === 'next' ? next : prev

    // Compose rather than let a caller's `onClick`/`disabled` silently replace navigation: the
    // carousel's own end-of-track state can only ever add a disable, and the click handler always
    // still navigates the carousel alongside whatever the caller's handler does.
    const isDisabled = disabled || (ends === 'stop' && atBoundary)
    const handleClick: typeof onClick = (event) => {
      onClick?.(event)
      if (event.detail !== 0) markPointerClick(event.currentTarget)
      navigate()
    }

    return (
      <button
        type="button"
        className={classNames('button small icon-only', className)}
        disabled={isDisabled}
        onClick={handleClick}
        {...rest}
        ref={forkedRef}
      >
        {children ?? (
          <>
            <Icon
              name={direction === 'next' ? 'chevron-right-outline' : 'chevron-left-outline'}
              className="directional-icon"
            />
            <span className="visually-hidden">{label}</span>
          </>
        )}
      </button>
    )
  }
)

CarouselControlButton.displayName = 'CarouselControlButton'
