import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { DrawerTitle } from '../../../src/index'

describe('DrawerTitle', () => {
  describe('rendering', () => {
    test('renders an h2 with the base class by default', () => {
      render(<DrawerTitle>Test</DrawerTitle>)
      const heading = screen.getByRole('heading', { level: 2, name: 'Test' })
      expect(heading).toHaveClass('drawer-title')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <DrawerTitle className="bazinga" component="h3">
          Test
        </DrawerTitle>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('drawer-title', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<DrawerTitle ref={ref}>Test</DrawerTitle>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<DrawerTitle>Test</DrawerTitle>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
