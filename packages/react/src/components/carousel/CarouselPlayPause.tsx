import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import classNames from 'classnames'

import { Icon } from '../icon'
import { useCarouselContext } from './context'

export interface CarouselPlayPauseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The accessible label announced while autoplay is running.
   */
  pauseLabel?: string
  /**
   * The accessible label announced while autoplay is stopped.
   */
  playLabel?: string
}

/**
 * A discoverable toggle so a viewer can stop an autoplaying carousel, as required by WCAG 2.2
 * Success Criterion 2.2.2 (Pause, Stop, Hide). Reflects the current state automatically — a pause
 * icon while playing, a play icon once stopped.
 */
export const CarouselPlayPause = forwardRef<HTMLButtonElement, CarouselPlayPauseProps>(
  ({ children, className, onClick, pauseLabel = 'Pause', playLabel = 'Play', ...rest }, ref) => {
    const { playing, togglePlayPause } = useCarouselContext()
    const _className = classNames(
      'carousel-control-play-pause button small icon-only',
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
        onClick={handleClick}
        {...rest}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon name="pause-solid" className="carousel-icon-pause" aria-hidden="true" />
            <Icon name="play-solid" className="carousel-icon-play" aria-hidden="true" />
          </>
        )}
      </button>
    )
  }
)

CarouselPlayPause.displayName = 'CarouselPlayPause'
