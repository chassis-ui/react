import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxForm, CxFormLabel, CxTextInput, CxFormHelp, CxCheckbox, Button } from '../../../index'

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
          <CxTextInput aria-describedby="B" aria-label="A" type="email" />
          <CxFormHelp>C</CxFormHelp>
          <CxCheckbox label="D" />
          <Button type="submit" color="primary">
            E
          </Button>
        </CxForm>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies the was-validated class and className together', () => {
      render(
        <CxForm className="bazinga" validated={true}>
          Test
        </CxForm>
      )
      expect(screen.getByText('Test')).toHaveClass('was-validated', 'bazinga')
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
          <CxTextInput aria-label="Email" id="email" type="email" />
        </CxForm>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
