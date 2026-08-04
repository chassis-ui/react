import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../index'

describe('Card.Image', () => {
  describe('rendering', () => {
    test('renders an img with the base class by default', () => {
      render(<Card.Image alt="" />)
      const image = screen.getByRole('img')
      expect(image).toHaveClass('card-image')
      expect(image.tagName).toBe('IMG')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Card.Image alt="" />)
      expect(container).toMatchSnapshot()
    })

    test('applies a top orientation class', () => {
      render(<Card.Image alt="" orientation="top" />)
      expect(screen.getByRole('img')).toHaveClass('card-image-top')
    })

    test('applies a bottom orientation class and renders as a custom component', () => {
      const { container } = render(
        <Card.Image className="bazinga" component="div" orientation="bottom" />
      )
      // Rendered as a bare `div` with no alt text or role, so there is no accessible query
      // that reaches it — `container.firstChild` is the only option.
      // eslint-disable-next-line testing-library/no-node-access
      const image = container.firstChild
      expect(image).toHaveClass('card-image-bottom', 'bazinga')
      expect((image as HTMLElement)?.nodeName).toBe('DIV')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying img', () => {
      const ref = React.createRef<HTMLImageElement>()
      render(<Card.Image ref={ref} alt="" />)
      expect(ref.current).toBeInstanceOf(HTMLImageElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card.Image alt="A card image" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
