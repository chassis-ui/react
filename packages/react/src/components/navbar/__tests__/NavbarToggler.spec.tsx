import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Navbar } from '../../../index'

describe('Navbar.Toggler', () => {
  describe('rendering', () => {
    test('renders a button with the base class', () => {
      render(<Navbar.Toggler>Test</Navbar.Toggler>)
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toHaveClass('navbar-toggler')
      expect(button).toHaveAttribute('type', 'button')
    })

    test('renders a default toggler icon when no children are provided', () => {
      // Decorative default icon: no text, no role, so there's no accessible query for it.
      const { container } = render(<Navbar.Toggler />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelectorAll('.navbar-toggler-icon')).toHaveLength(1)
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Navbar.Toggler />)
      expect(container).toMatchSnapshot()
    })

    test('applies a custom className', () => {
      render(<Navbar.Toggler className="bazinga" />)
      expect(screen.getByRole('button')).toHaveClass('navbar-toggler', 'bazinga')
    })
  })

  describe('click behavior', () => {
    test('fires onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<Navbar.Toggler onClick={onClick} />)
      await user.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<Navbar.Toggler ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Navbar.Toggler aria-label="Toggle navigation" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
