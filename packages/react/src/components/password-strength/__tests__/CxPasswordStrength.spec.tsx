import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { CxPasswordStrength } from '../../../index'

test('renders a meter with no strength for an empty password', () => {
  render(<CxPasswordStrength value="" />)
  const meter = screen.getByRole('meter', { name: 'Password strength' })
  expect(meter).toHaveAttribute('aria-valuenow', '0')
  expect(meter).not.toHaveAttribute('data-cx-strength')
})

test('a short lowercase-only password scores weak', () => {
  render(<CxPasswordStrength value="abc" />)
  const meter = screen.getByRole('meter')
  expect(meter).toHaveAttribute('data-cx-strength', 'weak')
})

test('a long mixed-case password with numbers and symbols scores strong', () => {
  render(<CxPasswordStrength value="Sup3r!Secret!Passphrase99" />)
  const meter = screen.getByRole('meter')
  expect(meter).toHaveAttribute('data-cx-strength', 'strong')
})

test('renders four segments by default, with the earned ones active', () => {
  const { container } = render(<CxPasswordStrength value="abcdefgh" />)
  const segments = container.querySelectorAll('.strength-segment')
  expect(segments).toHaveLength(4)
  // "abcdefgh" earns minLength(1) + lowercase(1) = 2 => weak => 1 active segment
  expect(container.querySelectorAll('.strength-segment.active')).toHaveLength(1)
})

test('bar variant renders no segments', () => {
  const { container } = render(<CxPasswordStrength value="abcdefgh" variant="bar" />)
  expect(container.querySelector('.strength-bar')).toBeInTheDocument()
  expect(container.querySelectorAll('.strength-segment')).toHaveLength(0)
})

test('shows the strength text message by default', () => {
  render(<CxPasswordStrength value="abcdefgh" />)
  expect(screen.getByText('Weak')).toBeInTheDocument()
})

test('showText={false} omits the text feedback element', () => {
  const { container } = render(<CxPasswordStrength showText={false} value="abcdefgh" />)
  expect(container.querySelector('.strength-text')).not.toBeInTheDocument()
})

test('custom messages override the defaults', () => {
  render(<CxPasswordStrength messages={{ weak: 'Too weak' }} value="abcdefgh" />)
  expect(screen.getByText('Too weak')).toBeInTheDocument()
})

test('onStrengthChange fires only when the strength level changes', () => {
  const onStrengthChange = jest.fn()
  const { rerender } = render(<CxPasswordStrength onStrengthChange={onStrengthChange} value="" />)
  expect(onStrengthChange).not.toHaveBeenCalled()

  rerender(<CxPasswordStrength onStrengthChange={onStrengthChange} value="abc" />)
  expect(onStrengthChange).toHaveBeenCalledTimes(1)
  expect(onStrengthChange).toHaveBeenLastCalledWith({ score: 1, strength: 'weak' })

  // Still weak, so no additional call.
  rerender(<CxPasswordStrength onStrengthChange={onStrengthChange} value="xyz" />)
  expect(onStrengthChange).toHaveBeenCalledTimes(1)
})

test('a custom scorer overrides the built-in criteria', () => {
  const scorer = () => 8
  render(<CxPasswordStrength scorer={scorer} value="x" />)
  const meter = screen.getByRole('meter')
  expect(meter).toHaveAttribute('data-cx-strength', 'strong')
})

test('custom thresholds shift the level boundaries', () => {
  // "abcdefgh" scores 2 (minLength + lowercase); with thresholds [1, 4, 6] that's "fair" instead
  // of the default "weak".
  render(<CxPasswordStrength thresholds={[1, 4, 6]} value="abcdefgh" />)
  const meter = screen.getByRole('meter')
  expect(meter).toHaveAttribute('data-cx-strength', 'fair')
})

test('disabling a weight via the weights prop excludes that criterion from scoring', () => {
  const onStrengthChange = jest.fn()
  render(
    <CxPasswordStrength
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
