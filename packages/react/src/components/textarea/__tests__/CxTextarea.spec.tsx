import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxTextarea } from '../../../index'

describe('CxTextarea', () => {
  describe('rendering', () => {
    test('renders a textarea with the base class by default', () => {
      render(<CxTextarea aria-label="Bio" defaultValue="Some value" />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      expect(textarea).toHaveClass('form-input')
      expect(textarea).toHaveValue('Some value')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxTextarea defaultValue="Some value" />)
      expect(container).toMatchSnapshot()
    })

    test('applies plainText, invalid/valid classes and disabled/readOnly attributes', () => {
      render(
        <CxTextarea
          aria-label="Bio"
          className="bazinga"
          disabled={true}
          invalid={true}
          plainText={true}
          readOnly={true}
          valid={true}
          defaultValue="Some value"
        />
      )
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      expect(textarea).toHaveClass('form-input', 'plaintext', 'is-invalid', 'is-valid', 'bazinga')
      expect(textarea).toBeDisabled()
      expect(textarea).toHaveAttribute('readonly')
    })
  })

  describe('change behavior', () => {
    test('fires onChange while typing (uncontrolled)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<CxTextarea aria-label="Bio" onChange={onChange} />)

      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      await user.type(textarea, 'hi')
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(textarea).toHaveValue('hi')
    })

    test('reflects a controlled value and does not update without a matching value prop', () => {
      const onChange = vi.fn()
      render(<CxTextarea aria-label="Bio" value="fixed" onChange={onChange} />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })

      fireEvent.change(textarea, { target: { value: 'changed' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(textarea).toHaveValue('fixed')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying textarea', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      render(<CxTextarea ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      const { container } = render(<CxTextarea aria-label="Bio" />)
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<CxTextarea label="Bio" />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      expect(textarea.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Bio').tagName).toBe('LABEL')
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<CxTextarea aria-label="Bio" help="Some help" />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(textarea.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby only when invalid', () => {
      const { rerender } = render(<CxTextarea aria-label="Bio" invalidFeedback="Required" />)
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<CxTextarea aria-label="Bio" invalid invalidFeedback="Required" />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(textarea.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<CxTextarea aria-label="Bio" valid validFeedback="Looks good" />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxTextarea aria-label="Bio" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('wires aria-invalid automatically from the invalid prop', () => {
      render(<CxTextarea aria-label="Bio" invalid />)
      expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute('aria-invalid', 'true')
    })
  })
})
