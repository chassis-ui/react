import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { DrawerContext } from '../Drawer'
import { Drawer } from '../../../index'

describe('Drawer.Header', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Drawer.Header className="bazinga">Test</Drawer.Header>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('drawer-header', 'bazinga')
      expect(header.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Drawer.Header>Test</Drawer.Header>)
      expect(container).toMatchSnapshot()
    })

    test('renders a close button by default', () => {
      render(<Drawer.Header>Test</Drawer.Header>)
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('can hide the close button', () => {
      render(<Drawer.Header closeButton={false}>Test</Drawer.Header>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })
  })

  describe('close behavior', () => {
    test('calls requestClose from context when the close button is clicked', async () => {
      const user = userEvent.setup()
      const requestClose = vi.fn()
      render(
        <DrawerContext.Provider value={{ requestClose }}>
          <Drawer.Header>Test</Drawer.Header>
        </DrawerContext.Provider>
      )
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(requestClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Drawer.Header ref={ref}>Test</Drawer.Header>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Drawer.Header>Test</Drawer.Header>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
