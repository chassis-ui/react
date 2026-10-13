import React, { ButtonHTMLAttributes, forwardRef, useEffect, useRef } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import { IconValue } from '../../utils/iconConfig'
import { IconSlot } from '../icon/iconSlot'
import { useCarouselContext } from './context'

export interface CarouselPlayPauseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The icon shown while autoplay is running: an icon name, or an element of your own icon set.
   * Defaults to `IconProvider`'s `pause` icon.
   */
  pauseIcon?: IconValue
  /**
   * The accessible label announced while autoplay is running.
   */
  pauseLabel?: string
  /**
   * The accessible label announced while autoplay is stopped.
   */
  playLabel?: string
  /**
   * The icon shown while autoplay is stopped: an icon name, or an element of your own icon set.
   * Defaults to `IconProvider`'s `play` icon.
   */
  playIcon?: IconValue
}

/**
 * A discoverable toggle so a viewer can stop an autoplaying carousel, as required by WCAG 2.2
 * Success Criterion 2.2.2 (Pause, Stop, Hide). Reflects the current state automatically — a pause
 * icon while playing, a play icon once stopped. On the last slide of an `ends="stop"` carousel
 * there is nothing left to play, and the stopped toggle is disabled, as the next control is.
 */
export const CarouselPlayPause = forwardRef<HTMLButtonElement, CarouselPlayPauseProps>(
  (
    {
      children,
      className,
      disabled,
      onClick,
      pauseIcon,
      pauseLabel = 'Pause',
      playIcon,
      playLabel = 'Play',
      ...rest
    },
    ref
  ) => {
    const { atEnd, ends, playing, registerControl, togglePlayPause } = useCarouselContext()
    const buttonRef = useRef<HTMLButtonElement>(null)
    const forkedRef = useForkedRef(ref, buttonRef)

    // Registered as the previous and next controls are, so the carousel moves focus off it when
    // the end of the track disables it.
    useEffect(() => {
      const element = buttonRef.current
      if (!element) return undefined
      return registerControl('play', element)
    }, [registerControl])

    // Pressed on the last slide of `ends="stop"`, Play started a cycle with no slide to go to.
    // Disabled there as the next control is, and only once stopped: while autoplay runs the
    // toggle is the way to pause it (WCAG 2.2.2). Composed with the caller's own `disabled`,
    // which the carousel's state can only add to.
    const isDisabled = disabled || (ends === 'stop' && atEnd && !playing)
    const _className = classNames(
      'carousel-control-play-pause button sm icon-only',
      { paused: !playing },
      className
    )
    // Compose rather than let a caller's `onClick` silently replace the toggle.
    const handleClick: typeof onClick = (event) => {
      onClick?.(event)
      togglePlayPause()
    }

    return (
      <button
        type="button"
        className={_className}
        aria-label={playing ? pauseLabel : playLabel}
        disabled={isDisabled}
        onClick={handleClick}
        {...rest}
        ref={forkedRef}
      >
        {children ?? (
          <>
            <IconSlot icon="pause" override={pauseIcon} className="carousel-icon-pause" />
            <IconSlot icon="play" override={playIcon} className="carousel-icon-play" />
          </>
        )}
      </button>
    )
  }
)

CarouselPlayPause.displayName = 'CarouselPlayPause'
