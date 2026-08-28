import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Button } from '../../../src/index'

describe('Button', () => {
  describe('rendering', () => {
    test('renders a native button by default', () => {
      render(<Button>Save</Button>)

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button.tagName).toBe('BUTTON')
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveClass('button', 'primary')
    })

    test('accepts an explicit type', () => {
      render(<Button type="submit">Submit</Button>)
      expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit')
    })

    test('renders as an anchor when href is provided', () => {
      render(<Button href="/bazinga">Go</Button>)

      const link = screen.getByRole('link', { name: 'Go' })
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('an explicit component wins over href, instead of href forcing an anchor', () => {
      render(
        <Button href="/bazinga" component="span">
          Go
        </Button>
      )
      const button = screen.getByRole('button', { name: 'Go' })
      expect(button.tagName).toBe('SPAN')
      expect(button).toHaveAttribute('href', '/bazinga')
    })

    test('renders as an input and keeps its type', () => {
      render(<Button component="input" type="submit" value="Save" />)

      const input = screen.getByRole('button', { name: 'Save' })
      expect(input.tagName).toBe('INPUT')
      expect(input).toHaveAttribute('type', 'submit')
      expect(input).toHaveAttribute('value', 'Save')
    })
  })

  describe('styling props', () => {
    test('applies color, variant, size, shape and className together', () => {
      render(
        <Button className="bazinga" color="warning" variant="outline" size="large" shape="rounded">
          Save
        </Button>
      )

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button).toHaveClass('button', 'warning', 'outline', 'large', 'rounded', 'bazinga')
    })

    test('applies the link variant as its own class, not a color', () => {
      render(
        <Button color="secondary" variant="link">
          Save
        </Button>
      )

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button).toHaveClass('button', 'secondary', 'link')
    })
  })

  describe('pressed state', () => {
    test('marks the button pressed and exposes aria-pressed for assistive tech', () => {
      render(<Button pressed>Bold</Button>)

      const button = screen.getByRole('button', { name: 'Bold' })
      expect(button).toHaveClass('active')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    test('does not set aria-current, unlike a nav-style active link', () => {
      render(<Button pressed>Bold</Button>)
      expect(screen.getByRole('button', { name: 'Bold' })).not.toHaveAttribute('aria-current')
    })
  })

  describe('click behavior', () => {
    test('fires onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<Button onClick={onClick}>Save</Button>)

      await user.click(screen.getByRole('button', { name: 'Save' }))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('disables the native button and blocks clicks', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Button disabled onClick={onClick}>
          Save
        </Button>
      )

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button).toBeDisabled()
      await user.click(button)
      expect(onClick).not.toHaveBeenCalled()
    })

    test('marks a disabled link as aria-disabled and blocks clicks, without an invalid disabled attribute', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Button href="/bazinga" disabled onClick={onClick}>
          Go
        </Button>
      )

      const link = screen.getByRole('link', { name: 'Go' })
      expect(link).toHaveAttribute('aria-disabled', 'true')
      expect(link).toHaveAttribute('tabIndex', '-1')
      expect(link).toHaveClass('disabled')
      expect(link).not.toHaveAttribute('disabled')
      await user.click(link)
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('custom component (keyboard activation via react-aria)', () => {
    test('exposes role="button" and keyboard focus on a non-native element', () => {
      render(<Button component="span">Save</Button>)

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button.tagName).toBe('SPAN')
      expect(button).toHaveAttribute('tabIndex', '0')
    })

    test('activates on click, Enter and Space, matching native button semantics', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Button component="span" onClick={onClick}>
          Save
        </Button>
      )
      const button = screen.getByRole('button', { name: 'Save' })

      await act(() => user.click(button))
      expect(onClick).toHaveBeenCalledTimes(1)

      // The click above already focused the span (react-aria makes it a tab stop);
      // Enter and Space should each trigger the same activation a native button gets for free.
      await act(() => user.keyboard('{Enter}'))
      expect(onClick).toHaveBeenCalledTimes(2)

      await act(() => user.keyboard('[Space]'))
      expect(onClick).toHaveBeenCalledTimes(3)
    })

    test('does not activate when disabled', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Button component="span" disabled onClick={onClick}>
          Save
        </Button>
      )
      const button = screen.getByRole('button', { name: 'Save' })

      expect(button).toHaveAttribute('aria-disabled', 'true')
      expect(button).toHaveClass('disabled')
      await user.click(button)
      expect(onClick).not.toHaveBeenCalled()
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
        <Button component={CustomLink} href="/bazinga">
          Go
        </Button>
      )
      const link = screen.getByRole('link', { name: 'Go' })
      expect(link.tagName).toBe('A')
      expect(link).not.toHaveAttribute('role')
      expect(link).not.toHaveAttribute('tabIndex')
    })

    test('onClick fires exactly once on click (no synthesized handler stacked on top)', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Button component={CustomLink} href="/bazinga" onClick={onClick}>
          Go
        </Button>
      )
      await user.click(screen.getByRole('link', { name: 'Go' }))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('forwards disabled raw instead of intercepting it, trusting the referenced component', () => {
      render(
        <Button component={CustomLink} href="/bazinga" disabled>
          Go
        </Button>
      )
      const link = screen.getByRole('link', { name: 'Go' })
      // Visual styling still applies, but the synthesized aria-disabled/click-block a bare HTML
      // tag would get doesn't - a bare <a> (standing in for `CustomLink`) has no native `disabled`
      // handling of its own, so this is the accepted tradeoff of trusting a component reference.
      expect(link).toHaveClass('disabled')
      expect(link).not.toHaveAttribute('aria-disabled')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a button ref for the default element', () => {
      const ref = React.createRef<HTMLButtonElement | HTMLAnchorElement>()
      render(<Button ref={ref}>Save</Button>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    test('forwards an anchor ref when rendered as a link', () => {
      const ref = React.createRef<HTMLButtonElement | HTMLAnchorElement>()
      render(
        <Button ref={ref} href="/bazinga">
          Go
        </Button>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying node for a custom component', () => {
      const ref = React.createRef<HTMLButtonElement | HTMLAnchorElement>()
      render(
        <Button ref={ref} component="span">
          Save
        </Button>
      )
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a button', async () => {
      const { container } = render(<Button>Save</Button>)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations as a disabled link', async () => {
      const { container } = render(
        <Button href="/bazinga" disabled>
          Go
        </Button>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
