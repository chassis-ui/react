import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Drawer } from '../../../index'

describe('Drawer.Body', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Drawer.Body className="bazinga">Test</Drawer.Body>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('drawer-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Drawer.Body>Test</Drawer.Body>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Drawer.Body ref={ref}>Test</Drawer.Body>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Drawer.Body>Test</Drawer.Body>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
