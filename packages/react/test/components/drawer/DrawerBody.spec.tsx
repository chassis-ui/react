import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { DrawerBody } from '../../../src/index'

describe('DrawerBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<DrawerBody className="bazinga">Test</DrawerBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('drawer-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<DrawerBody ref={ref}>Test</DrawerBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<DrawerBody>Test</DrawerBody>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
