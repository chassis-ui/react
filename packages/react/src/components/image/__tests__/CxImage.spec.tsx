import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxImage } from '../../../index'

describe('CxImage', () => {
  describe('rendering', () => {
    test('renders an img element', () => {
      render(<CxImage alt="" />)
      expect(screen.getByRole('img').tagName).toBe('IMG')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxImage alt="" />)
      expect(container).toMatchSnapshot()
    })
  })

  describe('styling props', () => {
    test('applies a start/end float alignment class', () => {
      render(<CxImage alt="" align="end" />)
      expect(screen.getByRole('img')).toHaveClass('float-end')
    })

    test('applies center alignment, fluid, rounded, thumbnail and className together', () => {
      render(
        <CxImage
          alt=""
          className="bazinga"
          align="center"
          fluid={true}
          rounded={true}
          thumbnail={true}
        />
      )
      expect(screen.getByRole('img')).toHaveClass(
        'd-block',
        'mx-auto',
        'img-fluid',
        'rounded',
        'img-thumbnail',
        'bazinga'
      )
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying img', () => {
      const ref = React.createRef<HTMLImageElement>()
      render(<CxImage ref={ref} alt="" />)
      expect(ref.current).toBeInstanceOf(HTMLImageElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxImage alt="A descriptive image" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
