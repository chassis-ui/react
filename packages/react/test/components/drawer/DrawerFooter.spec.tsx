import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { DrawerFooter } from '../../../src/index'

describe('DrawerFooter', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<DrawerFooter className="bazinga">Test</DrawerFooter>)
      const footer = screen.getByText('Test')
      expect(footer).toHaveClass('drawer-footer', 'bazinga')
      expect(footer.tagName).toBe('DIV')
    })

    test('applies the stacked class', () => {
      render(<DrawerFooter stacked>Test</DrawerFooter>)
      expect(screen.getByText('Test')).toHaveClass('drawer-footer', 'stacked')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<DrawerFooter ref={ref}>Test</DrawerFooter>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<DrawerFooter>Test</DrawerFooter>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
