import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { ToastClose } from '../../../src/index'
import { ToastContext } from '../../../src/components/toast/Toast'

describe('ToastClose', () => {
  describe('rendering', () => {
    test('renders a close button by default', () => {
      render(
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <ToastClose />
        </ToastContext.Provider>
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <ToastClose />
        </ToastContext.Provider>
      )
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component when given', () => {
      render(
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <ToastClose component="span">Dismiss</ToastClose>
        </ToastContext.Provider>
      )
      expect(screen.getByText('Dismiss').tagName).toBe('SPAN')
    })

    test('a custom span component is keyboard-operable, not just clickable', async () => {
      const user = userEvent.setup()
      const setVisible = vi.fn()
      render(
        <ToastContext.Provider value={{ setVisible }}>
          <ToastClose component="span">Dismiss</ToastClose>
        </ToastContext.Provider>
      )
      const button = screen.getByRole('button', { name: 'Dismiss' })
      expect(button).toHaveAttribute('tabIndex', '0')

      await act(() => user.keyboard('{Tab}'))
      expect(button).toHaveFocus()

      await act(() => user.keyboard('{Enter}'))
      expect(setVisible).toHaveBeenCalledWith(false)
    })
  })

  describe('click behavior', () => {
    test('closes the toast on click', async () => {
      const user = userEvent.setup()
      const setVisible = vi.fn()
      render(
        <ToastContext.Provider value={{ setVisible }}>
          <ToastClose />
        </ToastContext.Provider>
      )
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(setVisible).toHaveBeenCalledWith(false)
    })

    test('still closes the toast when a custom onClick is provided', async () => {
      const user = userEvent.setup()
      const setVisible = vi.fn()
      const onClick = vi.fn()
      render(
        <ToastContext.Provider value={{ setVisible }}>
          <ToastClose onClick={onClick} />
        </ToastContext.Provider>
      )
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(setVisible).toHaveBeenCalledWith(false)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <ToastClose ref={ref} />
        </ToastContext.Provider>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <ToastClose />
        </ToastContext.Provider>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
