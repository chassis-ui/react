import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxFormInput } from '../../../index'

describe('CxFormInput', () => {
  describe('rendering', () => {
    test('renders a text input with the base class by default', () => {
      render(<CxFormInput aria-label="Name" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      expect(input).toHaveClass('form-input')
      expect(input).toHaveAttribute('type', 'text')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFormInput />)
      expect(container).toMatchSnapshot()
    })

    test('applies plainText, size, invalid/valid and type=color classes together', () => {
      const { container } = render(
        <CxFormInput
          className="bazinga"
          invalid={true}
          plainText={true}
          size="large"
          type="color"
          valid={true}
        />
      )
      expect(container.firstChild).toHaveClass(
        'form-control-plaintext',
        'large',
        'form-input-color',
        'is-invalid',
        'is-valid',
        'bazinga'
      )
      expect(container.firstChild).toHaveAttribute('type', 'color')
    })

    test('applies disabled and readOnly attributes', () => {
      render(<CxFormInput aria-label="Name" disabled readOnly value="fixed" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      expect(input).toBeDisabled()
      expect(input).toHaveAttribute('readonly')
    })
  })

  describe('change behavior', () => {
    test('fires onChange while typing (uncontrolled)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<CxFormInput aria-label="Name" onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: 'Name' })
      await user.type(input, 'hi')
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(input).toHaveValue('hi')
    })

    test('reflects a controlled value and does not update without a matching value prop', () => {
      const onChange = vi.fn()
      render(<CxFormInput aria-label="Name" value="fixed" onChange={onChange} />)
      const input = screen.getByRole('textbox', { name: 'Name' })

      fireEvent.change(input, { target: { value: 'changed' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(input).toHaveValue('fixed')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<CxFormInput ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxFormInput aria-label="Name" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations when invalid', async () => {
      const { container } = render(<CxFormInput aria-label="Name" invalid aria-invalid="true" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
