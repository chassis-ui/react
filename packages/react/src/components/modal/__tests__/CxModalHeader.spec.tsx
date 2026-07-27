import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxModalContext } from '../CxModal'
import { CxModalHeader } from '../../../index'

describe('CxModalHeader', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<CxModalHeader className="bazinga">Test</CxModalHeader>)
      expect(container.firstChild).toHaveClass('modal-header', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxModalHeader>Test</CxModalHeader>)
      expect(container).toMatchSnapshot()
    })

    test('renders a close button by default', () => {
      render(<CxModalHeader>Test</CxModalHeader>)
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('can hide the close button', () => {
      render(<CxModalHeader closeButton={false}>Test</CxModalHeader>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })
  })

  describe('close behavior', () => {
    test('calls requestClose from context when the close button is clicked', async () => {
      const user = userEvent.setup()
      const requestClose = vi.fn()
      render(
        <CxModalContext.Provider value={{ requestClose }}>
          <CxModalHeader>Test</CxModalHeader>
        </CxModalContext.Provider>
      )
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(requestClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxModalHeader ref={ref}>Test</CxModalHeader>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxModalHeader>Test</CxModalHeader>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
