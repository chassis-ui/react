import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Chip } from '../../../src/index'

describe('Chip', () => {
  describe('rendering', () => {
    test('renders a span by default', () => {
      render(<Chip>Default</Chip>)
      const chip = screen.getByText('Default')
      expect(chip.tagName).toBe('SPAN')
      expect(chip).toHaveClass('chip')
    })

    test('renders as a custom element via component', () => {
      render(
        <Chip component="div" className="bazinga">
          Div
        </Chip>
      )
      const chip = screen.getByText('Div')
      expect(chip.tagName).toBe('DIV')
      expect(chip).toHaveClass('chip', 'bazinga')
    })

    test('renders as an anchor when href is provided', () => {
      render(<Chip href="/bazinga">Link</Chip>)
      const link = screen.getByRole('link', { name: 'Link' })
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('an explicit component wins over href, instead of href forcing an anchor', () => {
      render(
        <Chip href="/bazinga" component="span">
          Link
        </Chip>
      )
      const chip = screen.getByText('Link')
      expect(chip.tagName).toBe('SPAN')
      expect(chip).toHaveAttribute('href', '/bazinga')
    })

    test('renders as a native button', () => {
      render(<Chip component="button">Toggle</Chip>)
      const button = screen.getByRole('button', { name: 'Toggle' })
      expect(button.tagName).toBe('BUTTON')
      expect(button).toHaveAttribute('type', 'button')
    })

    test('accepts an explicit type on a button chip', () => {
      render(
        <Chip component="button" type="submit">
          Submit
        </Chip>
      )
      expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit')
    })
  })

  describe('styling props', () => {
    test('applies color, variant and size together', () => {
      render(
        <Chip color="primary" variant="smooth" size="large">
          Styled
        </Chip>
      )
      expect(screen.getByText('Styled')).toHaveClass('chip', 'primary', 'smooth', 'large')
    })

    test('applies the outline variant as its own class', () => {
      render(
        <Chip color="danger" variant="outline">
          Styled
        </Chip>
      )
      expect(screen.getByText('Styled')).toHaveClass('chip', 'danger', 'outline')
    })
  })

  describe('pressed state', () => {
    test('marks a button chip pressed and exposes aria-pressed', () => {
      render(
        <Chip component="button" pressed>
          Filter
        </Chip>
      )
      const button = screen.getByRole('button', { name: 'Filter' })
      expect(button).toHaveClass('active')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    test('marks an anchor chip pressed and exposes aria-pressed', () => {
      render(
        <Chip href="/bazinga" pressed>
          Filter
        </Chip>
      )
      const link = screen.getByRole('link', { name: 'Filter' })
      expect(link).toHaveClass('active')
      expect(link).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('disabled state', () => {
    test('disables a native button chip and blocks clicks', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Chip component="button" disabled onClick={onClick}>
          Toggle
        </Chip>
      )
      const button = screen.getByRole('button', { name: 'Toggle' })
      expect(button).toBeDisabled()
      expect(button).not.toHaveClass('disabled')
      await user.click(button)
      expect(onClick).not.toHaveBeenCalled()
    })

    test('applies the disabled class (not the attribute) to a non-button chip and blocks clicks', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Chip disabled onClick={onClick}>
          Static
        </Chip>
      )
      const chip = screen.getByText('Static')
      expect(chip).toHaveClass('disabled')
      expect(chip).not.toHaveAttribute('disabled')
      await user.click(chip)
      expect(onClick).not.toHaveBeenCalled()
    })

    test('marks a disabled default-element chip as aria-disabled', () => {
      render(<Chip disabled>Static</Chip>)
      expect(screen.getByText('Static')).toHaveAttribute('aria-disabled', 'true')
    })

    test('marks a disabled anchor chip as aria-disabled and blocks clicks', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Chip href="/bazinga" disabled onClick={onClick}>
          Link
        </Chip>
      )
      const link = screen.getByRole('link', { name: 'Link' })
      expect(link).toHaveAttribute('aria-disabled', 'true')
      expect(link).toHaveAttribute('tabIndex', '-1')
      expect(link).toHaveClass('disabled')
      await user.click(link)
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('click behavior', () => {
    test('fires onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<Chip onClick={onClick}>Static</Chip>)
      await user.click(screen.getByText('Static'))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('a default-element chip with onClick (the pressed/filter-chip use case) gets button keyboard semantics', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Chip pressed onClick={onClick}>
          Filter
        </Chip>
      )
      const chip = screen.getByRole('button', { name: 'Filter' })
      expect(chip.tagName).toBe('SPAN')
      expect(chip).toHaveAttribute('tabIndex', '0')

      chip.focus()
      await user.keyboard('{Enter}')
      expect(onClick).toHaveBeenCalledTimes(1)

      await user.keyboard(' ')
      expect(onClick).toHaveBeenCalledTimes(2)
    })

    test('a caller-supplied role (e.g. a custom grid/row composition) is left untouched', () => {
      render(
        <Chip component="div" role="row" onClick={vi.fn()}>
          Row
        </Chip>
      )
      expect(screen.getByRole('row', { name: 'Row' })).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a span ref for the default element', () => {
      const ref = React.createRef<HTMLElement>()
      render(<Chip ref={ref}>Default</Chip>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    test('forwards a button ref when rendered as a button', () => {
      const ref = React.createRef<HTMLElement>()
      render(
        <Chip ref={ref} component="button">
          Toggle
        </Chip>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    test('forwards an anchor ref when rendered as a link', () => {
      const ref = React.createRef<HTMLElement>()
      render(
        <Chip ref={ref} href="/bazinga">
          Link
        </Chip>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a static chip', async () => {
      const { container } = render(<Chip>Default</Chip>)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations as a disabled link chip', async () => {
      const { container } = render(
        <Chip href="/bazinga" disabled>
          Link
        </Chip>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations as a pressed filter chip', async () => {
      const { container } = render(
        <Chip pressed onClick={vi.fn()}>
          Filter
        </Chip>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
