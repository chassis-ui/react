import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CardImage } from '../../../src/index'

describe('CardImage', () => {
  describe('rendering', () => {
    test('renders an img with the base class by default', () => {
      render(<CardImage alt="test" />)
      const image = screen.getByRole('img')
      expect(image).toHaveClass('card-image')
      expect(image.tagName).toBe('IMG')
    })

    test('applies a top orientation class', () => {
      render(<CardImage alt="test" orientation="top" />)
      expect(screen.getByRole('img')).toHaveClass('card-image-top')
    })

    test('applies a start/end orientation class', () => {
      render(<CardImage alt="test" orientation="start" />)
      expect(screen.getByRole('img')).toHaveClass('card-image-start')
    })

    test('applies responsive orientation overrides alongside the base orientation', () => {
      render(<CardImage alt="test" orientation="top" responsive={{ large: 'start' }} />)
      expect(screen.getByRole('img')).toHaveClass('card-image-top', 'large:card-image-start')
    })

    test('applies a bottom orientation class and renders as a custom component', () => {
      const { container } = render(
        <CardImage className="bazinga" component="div" orientation="bottom" />
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
      render(<CardImage ref={ref} alt="" />)
      expect(ref.current).toBeInstanceOf(HTMLImageElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardImage alt="A card image" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
