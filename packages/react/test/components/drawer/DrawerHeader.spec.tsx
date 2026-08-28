import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { DrawerContext } from '../../../src/components/drawer/Drawer'
import { DrawerHeader } from '../../../src/index'

describe('DrawerHeader', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<DrawerHeader className="bazinga">Test</DrawerHeader>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('drawer-header', 'bazinga')
      expect(header.tagName).toBe('DIV')
    })

    test('renders a close button by default', () => {
      render(<DrawerHeader>Test</DrawerHeader>)
      const closeButton = screen.getByRole('button', { name: 'Close' })
      expect(closeButton).toBeInTheDocument()
      expect(closeButton).toHaveClass('close-button')
      expect(closeButton).toHaveAttribute('type', 'button')
    })

    test('can hide the close button', () => {
      render(<DrawerHeader closeButton={false}>Test</DrawerHeader>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })

    test('closeLabel overrides the close button accessible name', () => {
      render(<DrawerHeader closeLabel="Fermer">Test</DrawerHeader>)
      expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    })
  })

  describe('close behavior', () => {
    test('calls close from context when the close button is clicked', async () => {
      const user = userEvent.setup()
      const close = vi.fn()
      render(
        <DrawerContext.Provider value={{ close }}>
          <DrawerHeader>Test</DrawerHeader>
        </DrawerContext.Provider>
      )
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(close).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<DrawerHeader ref={ref}>Test</DrawerHeader>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<DrawerHeader>Test</DrawerHeader>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
