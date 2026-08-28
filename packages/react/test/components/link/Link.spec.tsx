import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Link } from '../../../src/index'

describe('Link', () => {
  describe('rendering', () => {
    test('renders an anchor by default', () => {
      render(<Link href="/bazinga">Test</Link>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('renders as a button when component is "button"', () => {
      render(<Link component="button">Test</Link>)
      expect(screen.getByRole('button', { name: 'Test' }).tagName).toBe('BUTTON')
    })

    test('defaults a button-rendered link to type="button" so it does not submit an ancestor form', () => {
      render(<Link component="button">Test</Link>)
      expect(screen.getByRole('button', { name: 'Test' })).toHaveAttribute('type', 'button')
    })

    test('respects an explicit type on a button-rendered link', () => {
      render(
        <Link component="button" type="submit">
          Test
        </Link>
      )
      expect(screen.getByRole('button', { name: 'Test' })).toHaveAttribute('type', 'submit')
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
      expect(link).not.toHaveAttribute('disabled')
    })

    test('disables a native button with the real disabled attribute', () => {
      render(
        <Link component="button" disabled>
          Test
        </Link>
      )
      expect(screen.getByRole('button')).toBeDisabled()
    })

    test('applies color, iconLink, reset and stretched as their own classes', () => {
      render(
        <Link href="/bazinga" color="primary" iconLink reset stretched>
          Test
        </Link>
      )
      const link = screen.getByRole('link')
      expect(link).toHaveClass('link-primary', 'icon-link', 'fg-reset', 'stretched-link')
    })

    test('places className last so caller overrides win over the built-in classes', () => {
      render(
        <Link href="/bazinga" color="primary" active className="bazinga">
          Test
        </Link>
      )
      expect(screen.getByRole('link').className).toBe('link-primary active bazinga')
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

  describe('custom component (keyboard activation via react-aria)', () => {
    test('exposes role="button" and keyboard focus on a non-interactive component with onClick', () => {
      render(
        <Link component="span" onClick={() => undefined}>
          Test
        </Link>
      )
      const link = screen.getByRole('button', { name: 'Test' })
      expect(link.tagName).toBe('SPAN')
      expect(link).toHaveAttribute('tabIndex', '0')
    })

    test('activates on click, Enter and Space, matching native button semantics', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Link component="span" onClick={onClick}>
          Test
        </Link>
      )
      const link = screen.getByRole('button', { name: 'Test' })

      await act(() => user.click(link))
      expect(onClick).toHaveBeenCalledTimes(1)

      await act(() => user.keyboard('{Enter}'))
      expect(onClick).toHaveBeenCalledTimes(2)

      await act(() => user.keyboard('[Space]'))
      expect(onClick).toHaveBeenCalledTimes(3)
    })

    test('does not get button semantics without an onClick, staying a plain non-interactive element', () => {
      render(<Link component="span">Test</Link>)
      const link = screen.getByText('Test')
      expect(link).not.toHaveAttribute('role')
      expect(link).not.toHaveAttribute('tabIndex')
    })
  })

  describe('component reference (trusted to handle its own semantics)', () => {
    const CustomLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >((props, ref) => <a ref={ref} {...props} />)
    CustomLink.displayName = 'CustomLink'

    test('does not stamp role="button"/tabIndex onto a component reference (unlike a bare HTML tag)', () => {
      render(
        <Link component={CustomLink} href="/bazinga" onClick={() => undefined}>
          Test
        </Link>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link.tagName).toBe('A')
      expect(link).not.toHaveAttribute('role')
      expect(link).not.toHaveAttribute('tabIndex')
    })

    test('onClick fires exactly once on click (no synthesized handler stacked on top)', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Link component={CustomLink} href="/bazinga" onClick={onClick}>
          Test
        </Link>
      )
      await user.click(screen.getByRole('link', { name: 'Test' }))
      expect(onClick).toHaveBeenCalledTimes(1)
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
