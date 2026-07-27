import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxButton } from '../../../index'

describe('CxButton', () => {
  describe('rendering', () => {
    test('renders a native button by default', () => {
      render(<CxButton>Save</CxButton>)

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button.tagName).toBe('BUTTON')
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveClass('button', 'primary')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxButton>Save</CxButton>)
      expect(container).toMatchSnapshot()
    })

    test('accepts an explicit type', () => {
      render(<CxButton type="submit">Submit</CxButton>)
      expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit')
    })

    test('renders as an anchor when href is provided', () => {
      render(<CxButton href="/bazinga">Go</CxButton>)

      const link = screen.getByRole('link', { name: 'Go' })
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('href takes precedence over an explicit component', () => {
      render(
        <CxButton href="/bazinga" component="span">
          Go
        </CxButton>
      )
      expect(screen.getByRole('link', { name: 'Go' }).tagName).toBe('A')
    })
  })

  describe('styling props', () => {
    test('applies context, variant, size, shape and className together', () => {
      render(
        <CxButton
          className="bazinga"
          context="warning"
          variant="outline"
          size="large"
          shape="rounded"
        >
          Save
        </CxButton>
      )

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button).toHaveClass('button', 'warning', 'outline', 'large', 'rounded', 'bazinga')
    })

    test('marks the button active and exposes aria-current for assistive tech', () => {
      render(<CxButton active>Save</CxButton>)

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button).toHaveClass('active')
      expect(button).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('click behavior', () => {
    test('fires onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<CxButton onClick={onClick}>Save</CxButton>)

      await user.click(screen.getByRole('button', { name: 'Save' }))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('disables the native button and blocks clicks', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <CxButton disabled onClick={onClick}>
          Save
        </CxButton>
      )

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button).toBeDisabled()
      await user.click(button)
      expect(onClick).not.toHaveBeenCalled()
    })

    test('marks a disabled link as aria-disabled and blocks clicks', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <CxButton href="/bazinga" disabled onClick={onClick}>
          Go
        </CxButton>
      )

      const link = screen.getByRole('link', { name: 'Go' })
      expect(link).toHaveAttribute('aria-disabled', 'true')
      expect(link).toHaveAttribute('tabIndex', '-1')
      await user.click(link)
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('custom component (keyboard activation via react-aria)', () => {
    test('exposes role="button" and keyboard focus on a non-native element', () => {
      render(<CxButton component="span">Save</CxButton>)

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button.tagName).toBe('SPAN')
      expect(button).toHaveAttribute('tabIndex', '0')
    })

    test('activates on click, Enter and Space, matching native button semantics', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <CxButton component="span" onClick={onClick}>
          Save
        </CxButton>
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
        <CxButton component="span" disabled onClick={onClick}>
          Save
        </CxButton>
      )
      const button = screen.getByRole('button', { name: 'Save' })

      expect(button).toHaveAttribute('aria-disabled', 'true')
      await user.click(button)
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a button ref for the default element', () => {
      const ref = React.createRef<HTMLButtonElement | HTMLAnchorElement>()
      render(<CxButton ref={ref}>Save</CxButton>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    test('forwards an anchor ref when rendered as a link', () => {
      const ref = React.createRef<HTMLButtonElement | HTMLAnchorElement>()
      render(
        <CxButton ref={ref} href="/bazinga">
          Go
        </CxButton>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying node for a custom component', () => {
      const ref = React.createRef<HTMLButtonElement | HTMLAnchorElement>()
      render(
        <CxButton ref={ref} component="span">
          Save
        </CxButton>
      )
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a button', async () => {
      const { container } = render(<CxButton>Save</CxButton>)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations as a disabled link', async () => {
      const { container } = render(
        <CxButton href="/bazinga" disabled>
          Go
        </CxButton>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
