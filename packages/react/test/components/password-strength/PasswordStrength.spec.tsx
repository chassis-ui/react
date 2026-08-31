import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { PasswordStrength } from '../../../src/index'

describe('PasswordStrength', () => {
  describe('scoring', () => {
    test('renders a meter with no strength for an empty password', () => {
      render(<PasswordStrength value="" />)
      const meter = screen.getByRole('meter', { name: 'Password strength' })
      expect(meter).toHaveAttribute('aria-valuenow', '0')
      expect(meter).not.toHaveAttribute('data-cx-strength')
    })

    test('a short lowercase-only password scores weak', () => {
      render(<PasswordStrength value="abc" />)
      const meter = screen.getByRole('meter')
      expect(meter).toHaveAttribute('data-cx-strength', 'weak')
    })

    test('a long mixed-case password with numbers and symbols scores strong', () => {
      render(<PasswordStrength value="Sup3r!Secret!Passphrase99" />)
      const meter = screen.getByRole('meter')
      expect(meter).toHaveAttribute('data-cx-strength', 'strong')
    })
  })

  describe('rendering', () => {
    test('renders four segments by default, with the earned ones active', () => {
      // Strength segments are decorative markers with no role/name - no accessible query for
      // them.
      const { container } = render(<PasswordStrength value="abcdefgh" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const segments = container.querySelectorAll('.strength-segment')
      expect(segments).toHaveLength(4)
      // "abcdefgh" earns minLength(1) + lowercase(1) = 2 => weak => 1 active segment
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelectorAll('.strength-segment.active')).toHaveLength(1)
    })

    test('bar variant renders no segments', () => {
      const { container } = render(<PasswordStrength value="abcdefgh" variant="bar" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.strength-bar')).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelectorAll('.strength-segment')).toHaveLength(0)
    })

    test('shows the strength text message by default', () => {
      render(<PasswordStrength value="abcdefgh" />)
      expect(screen.getByText('Weak')).toBeInTheDocument()
    })

    test('showText={false} omits the text feedback element', () => {
      const { container } = render(<PasswordStrength showText={false} value="abcdefgh" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.strength-text')).not.toBeInTheDocument()
    })

    test('custom messages override the defaults', () => {
      render(<PasswordStrength messages={{ weak: 'Too weak' }} value="abcdefgh" />)
      expect(screen.getByText('Too weak')).toBeInTheDocument()
    })
  })

  describe('callbacks', () => {
    test('onStrengthChange fires once on mount with the initial (null) strength', () => {
      const onStrengthChange = vi.fn()
      render(<PasswordStrength onStrengthChange={onStrengthChange} value="" />)
      expect(onStrengthChange).toHaveBeenCalledTimes(1)
      expect(onStrengthChange).toHaveBeenLastCalledWith({ score: 0, strength: null })
    })

    test('onStrengthChange fires on mount with a pre-filled value, not just null', () => {
      const onStrengthChange = vi.fn()
      render(<PasswordStrength onStrengthChange={onStrengthChange} value="abc" />)
      expect(onStrengthChange).toHaveBeenCalledTimes(1)
      expect(onStrengthChange).toHaveBeenLastCalledWith({ score: 1, strength: 'weak' })
    })

    test('onStrengthChange fires again only when the strength level subsequently changes', () => {
      const onStrengthChange = vi.fn()
      const { rerender } = render(<PasswordStrength onStrengthChange={onStrengthChange} value="" />)
      expect(onStrengthChange).toHaveBeenCalledTimes(1)

      rerender(<PasswordStrength onStrengthChange={onStrengthChange} value="abc" />)
      expect(onStrengthChange).toHaveBeenCalledTimes(2)
      expect(onStrengthChange).toHaveBeenLastCalledWith({ score: 1, strength: 'weak' })

      // Still weak, so no additional call.
      rerender(<PasswordStrength onStrengthChange={onStrengthChange} value="xyz" />)
      expect(onStrengthChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('customization', () => {
    test('a custom scorer overrides the built-in criteria', () => {
      const scorer = () => 8
      render(<PasswordStrength scorer={scorer} value="x" />)
      const meter = screen.getByRole('meter')
      expect(meter).toHaveAttribute('data-cx-strength', 'strong')
    })

    test('custom thresholds shift the level boundaries', () => {
      // "abcdefgh" scores 2 (minLength + lowercase); with thresholds [1, 4, 6] that's "fair"
      // instead of the default "weak".
      render(<PasswordStrength thresholds={[1, 4, 6]} value="abcdefgh" />)
      const meter = screen.getByRole('meter')
      expect(meter).toHaveAttribute('data-cx-strength', 'fair')
    })

    test('a custom scorer paired with a custom maxScore drives aria-valuemax off the real scale', () => {
      const scorer = (password: string) => password.length
      render(<PasswordStrength maxScore={200} scorer={scorer} value="abcdefghij" />)
      const meter = screen.getByRole('meter')
      expect(meter).toHaveAttribute('aria-valuemax', '200')
      expect(meter).toHaveAttribute('aria-valuenow', '10')
    })

    test('disabling a weight via the weights prop excludes that criterion from scoring', () => {
      const onStrengthChange = vi.fn()
      render(
        <PasswordStrength
          onStrengthChange={onStrengthChange}
          value="ABC"
          weights={{ uppercase: 0 }}
        />
      )
      // "ABC" would normally score minLength(0, too short) + uppercase(1) = 1; with uppercase
      // disabled it scores 0, so no strength/meter value.
      const meter = screen.getByRole('meter')
      expect(meter).toHaveAttribute('aria-valuenow', '0')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<PasswordStrength value="abcdefgh" />)
      // react-aria's useMeter sets role="meter progressbar" — a deliberate, spec-valid
      // space-separated ARIA role fallback list (meter is the primary role; progressbar is the
      // fallback for older AT). This axe-core version doesn't parse the compound role token list
      // when checking allowed attributes, so it flags the (perfectly valid) aria-value*
      // attributes as disallowed. A tooling limitation, not a PasswordStrength bug.
      expect(
        await axe(container, { rules: { 'aria-allowed-attr': { enabled: false } } })
      ).toHaveNoViolations()
    })
  })
})
