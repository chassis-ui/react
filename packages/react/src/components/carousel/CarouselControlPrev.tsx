import React, { ButtonHTMLAttributes, forwardRef, useContext, useEffect, useRef } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import { markPointerClick } from '../../utils/pointerInteraction'
import { Icon } from '../icon'
import { CarouselContext } from './context'

export interface CarouselControlPrevProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The accessible label announced by assistive technology.
   */
  label?: string
}

export const CarouselControlPrev = forwardRef<HTMLButtonElement, CarouselControlPrevProps>(
  ({ children, className, disabled, label = 'Previous slide', onClick, ...rest }, ref) => {
    const { atStart, ends, prev, registerControl } = useContext(CarouselContext)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const forkedRef = useForkedRef(ref, buttonRef)

    useEffect(() => {
      const element = buttonRef.current
      if (!element) return undefined
      return registerControl('prev', element)
    }, [registerControl])

    // Compose rather than let a caller's `onClick`/`disabled` silently replace navigation: the
    // carousel's own end-of-track state can only ever add a disable, and the click handler always
    // still navigates the carousel alongside whatever the caller's handler does.
    const isDisabled = disabled || (ends === 'stop' && atStart)
    const handleClick: typeof onClick = (event) => {
      onClick?.(event)
      if (event.detail !== 0) markPointerClick(event.currentTarget)
      prev()
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
            <Icon name="chevron-left-outline" className="directional-icon" />
            <span className="visually-hidden">{label}</span>
          </>
        )}
      </button>
    )
  }
)

CarouselControlPrev.displayName = 'CarouselControlPrev'
