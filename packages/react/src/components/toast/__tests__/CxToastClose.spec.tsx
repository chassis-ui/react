import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxToastClose } from '../../../index'
import { CxToastContext } from '../CxToast'

describe('CxToastClose', () => {
  describe('rendering', () => {
    test('renders a close button by default', () => {
      render(
        <CxToastContext.Provider value={{ setVisible: vi.fn() }}>
          <CxToastClose />
        </CxToastContext.Provider>
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxToastContext.Provider value={{ setVisible: vi.fn() }}>
          <CxToastClose />
        </CxToastContext.Provider>
      )
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component when given', () => {
      render(
        <CxToastContext.Provider value={{ setVisible: vi.fn() }}>
          <CxToastClose component="span">Dismiss</CxToastClose>
        </CxToastContext.Provider>
      )
      expect(screen.getByText('Dismiss').tagName).toBe('SPAN')
    })
  })

  describe('click behavior', () => {
    test('closes the toast on click', async () => {
      const user = userEvent.setup()
      const setVisible = vi.fn()
      render(
        <CxToastContext.Provider value={{ setVisible }}>
          <CxToastClose />
        </CxToastContext.Provider>
      )
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(setVisible).toHaveBeenCalledWith(false)
    })

    test('still closes the toast when a custom onClick is provided', async () => {
      const user = userEvent.setup()
      const setVisible = vi.fn()
      const onClick = vi.fn()
      render(
        <CxToastContext.Provider value={{ setVisible }}>
          <CxToastClose onClick={onClick} />
        </CxToastContext.Provider>
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
        <CxToastContext.Provider value={{ setVisible: vi.fn() }}>
          <CxToastClose ref={ref} />
        </CxToastContext.Provider>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxToastContext.Provider value={{ setVisible: vi.fn() }}>
          <CxToastClose />
        </CxToastContext.Provider>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
