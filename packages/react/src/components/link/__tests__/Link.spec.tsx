import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Link } from '../../../index'

describe('Link', () => {
  describe('rendering', () => {
    test('renders an anchor by default', () => {
      render(<Link href="/bazinga">Test</Link>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Link href="/bazinga">Test</Link>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a button when component is "button"', () => {
      render(<Link component="button">Test</Link>)
      expect(screen.getByRole('button', { name: 'Test' }).tagName).toBe('BUTTON')
    })

    test('renders as an arbitrary non-interactive component', () => {
      const { container } = render(<Link component="span">Test</Link>)
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })
  })

  describe('styling props', () => {
    test('applies active and disabled classes with className', () => {
      render(
        <Link className="bazinga" active component="button" disabled>
          Test
        </Link>
      )
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toHaveClass('bazinga', 'active', 'disabled')
      expect(button).toBeDisabled()
    })

    test('marks an active link with aria-current="page"', () => {
      render(
        <Link href="/bazinga" active>
          Test
        </Link>
      )
      expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
    })

    test('marks a disabled anchor as aria-disabled and removes it from tab order', () => {
      render(
        <Link href="/bazinga" disabled>
          Test
        </Link>
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('aria-disabled', 'true')
      expect(link).toHaveAttribute('tabIndex', '-1')
    })
  })

  describe('click behavior', () => {
    test('fires onClick on an interactive button', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Link component="button" onClick={onClick}>
          Test
        </Link>
      )
      await user.click(screen.getByRole('button', { name: 'Test' }))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('blocks onClick on a disabled interactive button', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Link component="button" disabled onClick={onClick}>
          Test
        </Link>
      )
      await user.click(screen.getByRole('button', { name: 'Test' }))
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor by default', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <Link ref={ref} href="/bazinga">
          Test
        </Link>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <Link ref={ref} component="button">
          Test
        </Link>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a link', async () => {
      const { container } = render(<Link href="/bazinga">Test</Link>)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations as a disabled link', async () => {
      const { container } = render(
        <Link href="/bazinga" disabled>
          Test
        </Link>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
