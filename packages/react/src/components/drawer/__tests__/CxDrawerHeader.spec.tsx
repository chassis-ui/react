import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxDrawerContext } from '../CxDrawer'
import { CxDrawerHeader } from '../../../index'

describe('CxDrawerHeader', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CxDrawerHeader className="bazinga">Test</CxDrawerHeader>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('drawer-header', 'bazinga')
      expect(header.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxDrawerHeader>Test</CxDrawerHeader>)
      expect(container).toMatchSnapshot()
    })

    test('renders a close button by default', () => {
      render(<CxDrawerHeader>Test</CxDrawerHeader>)
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('can hide the close button', () => {
      render(<CxDrawerHeader closeButton={false}>Test</CxDrawerHeader>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })
  })

  describe('close behavior', () => {
    test('calls requestClose from context when the close button is clicked', async () => {
      const user = userEvent.setup()
      const requestClose = vi.fn()
      render(
        <CxDrawerContext.Provider value={{ requestClose }}>
          <CxDrawerHeader>Test</CxDrawerHeader>
        </CxDrawerContext.Provider>
      )
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(requestClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxDrawerHeader ref={ref}>Test</CxDrawerHeader>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxDrawerHeader>Test</CxDrawerHeader>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
