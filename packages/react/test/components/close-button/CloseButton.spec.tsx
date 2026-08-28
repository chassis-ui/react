import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
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
  })

  describe('styling props', () => {
    test('applies size, disabled and className together', () => {
      render(<CloseButton size="large" disabled className="bazinga" />)
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button).toHaveClass('close-button', 'large', 'bazinga')
      expect(button).toBeDisabled()
    })

    test('adds the context class alongside color', () => {
      render(<CloseButton color="primary" />)
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button).toHaveClass('close-button', 'context', 'primary')
    })

    test('adds the context class alongside variant', () => {
      render(<CloseButton variant="solid" />)
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button).toHaveClass('close-button', 'context', 'solid')
    })

    test('does not add the context class when neither color nor variant is set', () => {
      render(<CloseButton />)
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button).not.toHaveClass('context')
    })
  })

  describe('type attribute', () => {
    test('defaults to type="button" so it never submits an ancestor form', () => {
      render(<CloseButton />)
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button).toHaveAttribute('type', 'button')
    })

    test('allows overriding the type', () => {
      render(<CloseButton type="submit" />)
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('label prop', () => {
    test('localizes the accessible name via the label prop', () => {
      render(<CloseButton label="Fermer" />)
      expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    })

    test('allows an explicit aria-label to override the label prop', () => {
      render(<CloseButton label="Fermer" aria-label="Cerrar" />)
      expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
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

  describe('custom component (keyboard activation via react-aria)', () => {
    test('exposes role="button" and keyboard focus on a non-native element', () => {
      render(<CloseButton component="span" />)
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button.tagName).toBe('SPAN')
      expect(button).toHaveAttribute('tabIndex', '0')
    })

    test('activates on click, Enter and Space, matching native button semantics', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<CloseButton component="span" onClick={onClick} />)
      const button = screen.getByRole('button', { name: 'Close' })

      await act(() => user.click(button))
      expect(onClick).toHaveBeenCalledTimes(1)

      await act(() => user.keyboard('{Enter}'))
      expect(onClick).toHaveBeenCalledTimes(2)

      await act(() => user.keyboard('[Space]'))
      expect(onClick).toHaveBeenCalledTimes(3)
    })

    test('does not activate when disabled', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<CloseButton component="span" disabled onClick={onClick} />)
      const button = screen.getByRole('button', { name: 'Close' })

      expect(button).toHaveAttribute('aria-disabled', 'true')
      expect(button).toHaveClass('disabled')
      await user.click(button)
      expect(onClick).not.toHaveBeenCalled()
    })

    test('a component reference is trusted to handle its own semantics (no double role/tabIndex)', () => {
      const Custom = React.forwardRef<HTMLButtonElement>((props, ref) => (
        <button type="button" ref={ref} {...props} />
      ))
      render(<CloseButton component={Custom} />)
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button.tagName).toBe('BUTTON')
    })
  })

  describe('component="a"', () => {
    test('a disabled anchor gets the disabled class, aria-disabled and tabIndex=-1, and blocks clicks', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<CloseButton component="a" href="/bazinga" disabled onClick={onClick} />)
      const link = screen.getByRole('link', { name: 'Close' })

      expect(link).toHaveClass('close-button', 'disabled')
      expect(link).toHaveAttribute('aria-disabled', 'true')
      expect(link).toHaveAttribute('tabIndex', '-1')
      await user.click(link)
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CloseButton />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
