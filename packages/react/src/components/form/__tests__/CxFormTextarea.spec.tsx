import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxFormTextarea } from '../../../index'

describe('CxFormTextarea', () => {
  describe('rendering', () => {
    test('renders a textarea with the base class by default', () => {
      render(<CxFormTextarea aria-label="Bio" defaultValue="Some value" />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      expect(textarea).toHaveClass('form-input')
      expect(textarea).toHaveValue('Some value')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFormTextarea defaultValue="Some value" />)
      expect(container).toMatchSnapshot()
    })

    test('applies plainText, invalid/valid classes and disabled/readOnly attributes', () => {
      render(
        <CxFormTextarea
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
      expect(textarea).toHaveClass('form-control-plaintext', 'is-invalid', 'is-valid', 'bazinga')
      expect(textarea).toBeDisabled()
      expect(textarea).toHaveAttribute('readonly')
    })
  })

  describe('change behavior', () => {
    test('fires onChange while typing (uncontrolled)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<CxFormTextarea aria-label="Bio" onChange={onChange} />)

      const textarea = screen.getByRole('textbox', { name: 'Bio' })
      await user.type(textarea, 'hi')
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(textarea).toHaveValue('hi')
    })

    test('reflects a controlled value and does not update without a matching value prop', () => {
      const onChange = vi.fn()
      render(<CxFormTextarea aria-label="Bio" value="fixed" onChange={onChange} />)
      const textarea = screen.getByRole('textbox', { name: 'Bio' })

      fireEvent.change(textarea, { target: { value: 'changed' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(textarea).toHaveValue('fixed')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying textarea', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      render(<CxFormTextarea ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxFormTextarea aria-label="Bio" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
