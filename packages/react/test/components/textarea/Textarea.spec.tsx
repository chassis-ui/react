import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Textarea } from '../../../src/index'

describe('Textarea', () => {
  describe('rendering', () => {
    test('renders a textarea with the base class by default', () => {
      render(<Textarea aria-label="Bio" defaultValue="Some value" />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      expect(textarea).toHaveClass('form-input')
      expect(textarea).toHaveValue('Some value')
      expect(textarea).toHaveAttribute('tabindex', '0')
    })

    test('forwards the rows attribute to the underlying textarea', () => {
      render(<Textarea aria-label="Bio" rows={6} />)
      expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute('rows', '6')
    })

    test('applies plainText, size and invalid/valid classes and disabled/readOnly attributes', () => {
      render(
        <Textarea
          aria-label="Bio"
          className="bazinga"
          disabled={true}
          invalid={true}
          plainText={true}
          readOnly={true}
          size="large"
          valid={true}
          defaultValue="Some value"
        />
      )
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      expect(textarea).toHaveClass(
        'form-input',
        'plaintext',
        'large',
        'is-invalid',
        'is-valid',
        'bazinga'
      )
      expect(textarea).toBeDisabled()
      expect(textarea).toHaveAttribute('readonly')
    })
  })

  describe('change behavior', () => {
    test('fires onChange while typing (uncontrolled)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Textarea aria-label="Bio" onChange={onChange} />)

      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      // react-aria's internal validation-state effect updates state as a direct consequence of
      // `user.type`'s own dispatch, outside whatever act-environment userEvent itself toggles
      // (confirmed by capturing `IS_REACT_ACT_ENVIRONMENT` at warning time for the equivalent
      // DatePicker case) - needs an explicit `act(...)` around the interaction.
      // eslint-disable-next-line testing-library/no-unnecessary-act -- see comment above
      await act(async () => {
        await user.type(textarea, 'hi')
      })
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(textarea).toHaveValue('hi')
    })

    test('reflects a controlled value and does not update without a matching value prop', () => {
      const onChange = vi.fn()
      render(<Textarea aria-label="Bio" value="fixed" onChange={onChange} />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })

      fireEvent.change(textarea, { target: { value: 'changed' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(textarea).toHaveValue('fixed')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying textarea', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      render(<Textarea aria-label="Bio" ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<Textarea aria-label="Bio" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<Textarea label="Bio" />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(textarea.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Bio').tagName).toBe('LABEL')
    })

    // FORMS.md gotcha #5: useTextField's own dev-mode check only sees the DOM node's own
    // aria-label/aria-labelledby, not the separately-rendered <FormLabel htmlFor>, so it must be
    // fed the merged labelledBy explicitly or it false-positives on every `label`-only render.
    test('does not trigger the react-aria missing-accessible-name warning when only label is set', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      render(<Textarea label="Bio" />)
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<Textarea aria-label="Bio" help="Some help" />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(textarea.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby only when invalid', () => {
      const { rerender } = render(<Textarea aria-label="Bio" invalidFeedback="Required" />)
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<Textarea aria-label="Bio" invalid invalidFeedback="Required" />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(textarea.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<Textarea aria-label="Bio" valid validFeedback="Looks good" />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Textarea aria-label="Bio" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('wires aria-invalid automatically from the invalid prop', () => {
      render(<Textarea aria-label="Bio" invalid />)
      expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute('aria-invalid', 'true')
    })

    test('has no axe violations in a realistic composed state (label, help, invalidFeedback)', async () => {
      const { container } = render(
        <Textarea
          label="Bio"
          help="Tell us about yourself"
          invalid
          invalidFeedback="Required"
          defaultValue="Some value"
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
