import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxForm, CxFormLabel, CxTextInput, CxFormHelp, CxCheckbox, CxButton } from '../../../index'

describe('CxForm', () => {
  describe('rendering', () => {
    test('renders a form element', () => {
      render(<CxForm aria-label="Sign up">Test</CxForm>)
      const form = screen.getByRole('form', { name: 'Sign up' })
      expect(form.tagName).toBe('FORM')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxForm>
          <CxFormLabel>A</CxFormLabel>
          <CxTextInput type="email" aria-describedby="B" />
          <CxFormHelp>C</CxFormHelp>
          <CxCheckbox label="D" />
          <CxButton type="submit" context="primary">
            E
          </CxButton>
        </CxForm>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies the was-validated class and className together', () => {
      const { container } = render(
        <CxForm className="bazinga" validated={true}>
          Test
        </CxForm>
      )
      expect(container.firstChild).toHaveClass('was-validated', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying form', () => {
      const ref = React.createRef<HTMLFormElement>()
      render(<CxForm ref={ref}>Test</CxForm>)
      expect(ref.current).toBeInstanceOf(HTMLFormElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxForm aria-label="Sign up">
          <CxFormLabel htmlFor="email">Email</CxFormLabel>
          <CxTextInput id="email" type="email" />
        </CxForm>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
