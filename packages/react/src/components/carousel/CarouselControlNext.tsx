import React, { ButtonHTMLAttributes, forwardRef, useContext, useEffect, useRef } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import { markPointerClick } from '../../utils/pointerInteraction'
import { Icon } from '../icon'
import { CarouselContext } from './context'

export interface CarouselControlNextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The accessible label announced by assistive technology.
   */
  label?: string
}

export const CarouselControlNext = forwardRef<HTMLButtonElement, CarouselControlNextProps>(
  ({ children, className, disabled, label = 'Next slide', onClick, ...rest }, ref) => {
    const { atEnd, ends, next, registerControl } = useContext(CarouselContext)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const forkedRef = useForkedRef(ref, buttonRef)

    useEffect(() => {
      const element = buttonRef.current
      if (!element) return undefined
      return registerControl('next', element)
    }, [registerControl])

    // Compose rather than let a caller's `onClick`/`disabled` silently replace navigation: the
    // carousel's own end-of-track state can only ever add a disable, and the click handler always
    // still advances the carousel alongside whatever the caller's handler does.
    const isDisabled = disabled || (ends === 'stop' && atEnd)
    const handleClick: typeof onClick = (event) => {
      onClick?.(event)
      if (event.detail !== 0) markPointerClick(event.currentTarget)
      next()
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
            <Icon name="chevron-right-outline" className="directional-icon" />
            <span className="visually-hidden">{label}</span>
          </>
        )}
      </button>
    )
  }
)

CarouselControlNext.displayName = 'CarouselControlNext'
