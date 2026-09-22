import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import classNames from 'classnames'

import { IconValue } from '../../utils/iconConfig'
import { IconSlot } from '../../utils/iconSlot'
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
 * icon while playing, a play icon once stopped.
 */
export const CarouselPlayPause = forwardRef<HTMLButtonElement, CarouselPlayPauseProps>(
  (
    {
      children,
      className,
      onClick,
      pauseIcon,
      pauseLabel = 'Pause',
      playIcon,
      playLabel = 'Play',
      ...rest
    },
    ref
  ) => {
    const { playing, togglePlayPause } = useCarouselContext()
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
        onClick={handleClick}
        {...rest}
        ref={ref}
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
