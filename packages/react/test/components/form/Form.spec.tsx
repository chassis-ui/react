import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Form, FormLabel, TextInput, FormHelp, Checkbox, Button } from '../../../src/index'

describe('Form', () => {
  describe('rendering', () => {
    test('renders a form element', () => {
      render(<Form aria-label="Sign up">Test</Form>)
      const form = screen.getByRole('form', { name: 'Sign up' })
      expect(form.tagName).toBe('FORM')
    })

    test('renders composed form field markup with the expected classes', () => {
      render(
        <Form>
          <FormLabel>A</FormLabel>
          <TextInput aria-describedby="B" aria-label="A" type="email" />
          <FormHelp>C</FormHelp>
          <Checkbox label="D" />
          <Button type="submit" color="primary">
            E
          </Button>
        </Form>
      )
      expect(screen.getByText('A')).toHaveClass('form-label')
      const input = screen.getByLabelText('A')
      expect(input).toHaveClass('form-input')
      expect(input).toHaveAttribute('type', 'email')
      expect(screen.getByText('E')).toHaveClass('button', 'primary')
    })

    test('applies the was-validated class and className together', () => {
      render(
        <Form className="bazinga" validated={true}>
          Test
        </Form>
      )
      expect(screen.getByText('Test')).toHaveClass('was-validated', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying form', () => {
      const ref = React.createRef<HTMLFormElement>()
      render(<Form ref={ref}>Test</Form>)
      expect(ref.current).toBeInstanceOf(HTMLFormElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Form aria-label="Sign up">
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextInput aria-label="Email" id="email" type="email" />
        </Form>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
