import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CloseButton } from '../../../src/index'

describe('CloseButton', () => {
  describe('rendering', () => {
    test('renders a button with the base class and a Close accessible label', () => {
      render(<CloseButton />)
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button).toHaveClass('close-button')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CloseButton />)
      expect(container).toMatchSnapshot()
    })
  })

  describe('styling props', () => {
    test('applies white, disabled and className together', () => {
      render(<CloseButton white disabled className="bazinga" />)
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button).toHaveClass('close-button', 'white', 'bazinga')
      expect(button).toBeDisabled()
    })
  })

  describe('click behavior', () => {
    test('fires onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<CloseButton onClick={onClick} />)
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<CloseButton ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CloseButton />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
