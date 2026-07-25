import React, { forwardRef, HTMLAttributes, useContext, useEffect, useState, useRef } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../utils/hooks'
import { CxCarouselContext } from './CxCarousel'
export interface CxCarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * @ignore
   */
  active?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * @ignore
   */
  direction?: string
  /**
   * The amount of time to delay between automatically cycling an item.
   */
  interval?: boolean | number
}

export const CxCarouselItem = forwardRef<HTMLDivElement, CxCarouselItemProps>(
  ({ children, className, active, direction, interval = false, ...rest }, ref) => {
    const { setAnimating, setCustomInterval } = useContext(CxCarouselContext)
    const carouselItemRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, carouselItemRef)

    const prevActive = useRef<boolean>()
    const [directionClassName, setDirectionClassName] = useState<string>()
    const [orderClassName, setOrderClassName] = useState<string>()
    const [activeClassName, setActiveClassName] = useState(active && 'active')
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (active) {
        setCustomInterval(interval)
        if (count !== 0) setOrderClassName(`carousel-item-${direction}`)
      }

      if (prevActive.current && !active) {
        setActiveClassName('active')
      }

      if (active || prevActive.current) {
        setTimeout(() => {
          if (count !== 0) {
            // @ts-expect-error reflow is necessary to proper transition
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const reflow = carouselItemRef.current?.offsetHeight
            setDirectionClassName(`carousel-item-${direction === 'next' ? 'start' : 'end'}`)
          }
        }, 0)
      }

      prevActive.current = active

      if (count === 0) setCount(count + 1)
    }, [active])

    useEffect(() => {
      carouselItemRef.current?.addEventListener('transitionstart', () => {
        active && setAnimating(true)
      })
      carouselItemRef.current?.addEventListener('transitionend', () => {
        active && setAnimating(false)
        setDirectionClassName('')
        setOrderClassName('')
        if (active) {
          setActiveClassName('active')
        }
        if (!active) {
          setActiveClassName('')
        }
      })
      return () => {
        carouselItemRef.current?.removeEventListener('transitionstart', () => {
          active && setAnimating(true)
        })
        carouselItemRef.current?.removeEventListener('transitionend', () => {
          active && setAnimating(false)
          setDirectionClassName('')
          setOrderClassName('')
          if (active) {
            setActiveClassName('active')
          }
          if (!active) {
            setActiveClassName('')
          }
        })
      }
    })

    const _className = classNames(
      'carousel-item',
      activeClassName,
      directionClassName,
      orderClassName,
      className,
    )

    return (
      <div className={_className} ref={forkedRef} {...rest}>
        {children}
      </div>
    )
  },
)

CxCarouselItem.displayName = 'CxCarouselItem'
