import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Drawer } from '../../../index'

describe('Drawer.Footer', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Drawer.Footer className="bazinga">Test</Drawer.Footer>)
      const footer = screen.getByText('Test')
      expect(footer).toHaveClass('drawer-footer', 'bazinga')
      expect(footer.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Drawer.Footer>Test</Drawer.Footer>)
      expect(container).toMatchSnapshot()
    })

    test('applies the stacked class', () => {
      render(<Drawer.Footer stacked>Test</Drawer.Footer>)
      expect(screen.getByText('Test')).toHaveClass('drawer-footer', 'stacked')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Drawer.Footer ref={ref}>Test</Drawer.Footer>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Drawer.Footer>Test</Drawer.Footer>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
