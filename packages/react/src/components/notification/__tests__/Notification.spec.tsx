import * as React from 'react'
import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Notification } from '../../../index'

describe('Notification', () => {
  describe('rendering', () => {
    test('renders a div with the base class and an alert role', () => {
      render(<Notification color="primary">Test</Notification>)
      const notification = screen.getByRole('alert')
      expect(notification).toHaveClass('notification', 'primary')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Notification color="primary">Test</Notification>)
      expect(container).toMatchSnapshot()
    })

    test('applies the solid variant background/foreground classes with className', () => {
      render(
        <Notification color="secondary" className="bazinga" variant="solid">
          Test
        </Notification>
      )
      const notification = screen.getByRole('alert')
      expect(notification).toHaveClass('bg-secondary', 'fg-white', 'bazinga')
    })
  })

  describe('dismiss behavior', () => {
    test('renders a close button when dismissible and calls onClose on click', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <Notification color="primary" dismissible onClose={onClose}>
          Test
        </Notification>
      )
      expect(onClose).toHaveBeenCalledTimes(0)
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      act(() => vi.runAllTimers())
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    test('does not render a close button by default', () => {
      render(<Notification color="primary">Test</Notification>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Notification ref={ref}>Test</Notification>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Notification color="primary" dismissible>
          Test
        </Notification>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
