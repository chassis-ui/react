import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardImage } from '../../../index'

describe('CxCardImage', () => {
  describe('rendering', () => {
    test('renders an img with the base class by default', () => {
      render(<CxCardImage alt="" />)
      const image = screen.getByRole('img')
      expect(image).toHaveClass('card-image')
      expect(image.tagName).toBe('IMG')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCardImage alt="" />)
      expect(container).toMatchSnapshot()
    })

    test('applies a top orientation class', () => {
      render(<CxCardImage alt="" orientation="top" />)
      expect(screen.getByRole('img')).toHaveClass('card-image-top')
    })

    test('applies a bottom orientation class and renders as a custom component', () => {
      const { container } = render(
        <CxCardImage className="bazinga" component="div" orientation="bottom" />
      )
      expect(container.firstChild).toHaveClass('card-image-bottom', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying img', () => {
      const ref = React.createRef<HTMLImageElement>()
      render(<CxCardImage ref={ref} alt="" />)
      expect(ref.current).toBeInstanceOf(HTMLImageElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardImage alt="A card image" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
