import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Carousel } from '../../../index'

const ThreeItemCarousel = (props: Partial<React.ComponentProps<typeof Carousel>> = {}) => (
  <Carousel controls indicators {...props}>
    <Carousel.Item>
      Item-1
      <Carousel.Caption>Caption-1</Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      Item-2
      <Carousel.Caption>Caption-2</Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      Item-3
      <Carousel.Caption>Caption-3</Carousel.Caption>
    </Carousel.Item>
  </Carousel>
)

describe('Carousel', () => {
  describe('rendering', () => {
    test('renders the slide wrapper, indicators list and inner track', () => {
      // The .carousel wrapper and .carousel-inner track are plain divs with no role of their
      // own - no accessible query reaches them directly.
      const { container } = render(<ThreeItemCarousel />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const carousel = container.querySelector('.carousel') as HTMLElement
      expect(carousel).toHaveClass('slide')
      expect(screen.getByRole('list')).toHaveClass('carousel-indicators')
      // eslint-disable-next-line testing-library/no-node-access
      expect(carousel.querySelector('.carousel-inner')).toBeInTheDocument()
    })

    test('renders each item and caption with the base classes', () => {
      render(<ThreeItemCarousel />)
      expect(screen.getByText('Item-1')).toHaveClass('carousel-item')
      expect(screen.getByText('Item-2')).toHaveClass('carousel-item')
      expect(screen.getByText('Item-3')).toHaveClass('carousel-item')
      expect(screen.getByText('Caption-1')).toHaveClass('carousel-caption')
      expect(screen.getByText('Caption-2')).toHaveClass('carousel-caption')
      expect(screen.getByText('Caption-3')).toHaveClass('carousel-caption')
    })

    test('renders labeled previous/next controls with decorative icons', () => {
      render(<ThreeItemCarousel />)
      const next = screen.getByRole('button', { name: 'Next slide' })
      const prev = screen.getByRole('button', { name: 'Previous slide' })
      // The icon is aria-hidden and decorative - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(next.firstChild).toHaveClass('carousel-control-next-icon')
      // eslint-disable-next-line testing-library/no-node-access
      expect(prev.firstChild).toHaveClass('carousel-control-prev-icon')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<ThreeItemCarousel />)
      expect(container).toMatchSnapshot()
    })
  })

  describe('indicator navigation', () => {
    test('clicking an indicator advances and returning to the first restores the original active item', () => {
      render(<ThreeItemCarousel />)
      const item1 = screen.getByText('Item-1')
      const item2 = screen.getByText('Item-2')

      expect(item1).toHaveClass('active', 'carousel-item')
      expect(item2).not.toHaveClass('active')
      expect(item2).toHaveClass('carousel-item')

      fireEvent.click(screen.getByRole('button', { name: 'Slide 2' }))
      fireEvent.transitionEnd(item1)
      fireEvent.transitionEnd(item2)

      expect(item1).not.toHaveClass('active')
      expect(item2).toHaveClass('active')

      fireEvent.click(screen.getByRole('button', { name: 'Slide 1' }))
      fireEvent.transitionEnd(item1)
      fireEvent.transitionEnd(item2)

      expect(item1).toHaveClass('active')
      expect(item2).not.toHaveClass('active')
    })
  })

  describe('control button navigation', () => {
    test('Next/Previous buttons move the active item forward and back', () => {
      render(<ThreeItemCarousel />)
      const item1 = screen.getByText('Item-1')
      const item2 = screen.getByText('Item-2')

      expect(item1).toHaveClass('active', 'carousel-item')
      expect(item2).not.toHaveClass('active')
      expect(item2).toHaveClass('carousel-item')

      fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
      fireEvent.transitionEnd(item1)
      fireEvent.transitionEnd(item2)

      expect(item1).not.toHaveClass('active')
      expect(item2).toHaveClass('active')

      fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
      fireEvent.transitionEnd(item1)
      fireEvent.transitionEnd(item2)

      expect(item1).toHaveClass('active')
      expect(item2).not.toHaveClass('active')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Carousel ref={ref}>
          <Carousel.Item>Item-1</Carousel.Item>
        </Carousel>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<ThreeItemCarousel />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
