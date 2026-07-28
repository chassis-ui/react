import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxFormField } from '../../../index'

describe('CxFormField', () => {
  describe('rendering', () => {
    test('renders children bare when no label/help/feedback are set', () => {
      const { container } = render(
        <CxFormField>
          <input aria-label="Name" />
        </CxFormField>
      )
      expect(container.querySelector('.form-field')).toBeNull()
      expect(container.firstChild).toBe(screen.getByRole('textbox', { name: 'Name' }))
    })

    test('renders the .form-field wrapper and a label associated via htmlFor', () => {
      render(
        <CxFormField label="Name" ids={{ input: 'name' }}>
          <input id="name" />
        </CxFormField>
      )
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('id', 'name')
      expect(screen.getByText('Name').tagName).toBe('LABEL')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxFormField
          label="Email"
          help="We'll never share it."
          ids={{ input: 'email', help: 'email-help' }}
        >
          <input id="email" aria-describedby="email-help" />
        </CxFormField>
      )
      expect(container).toMatchSnapshot()
    })

    test('renders help text', () => {
      render(
        <CxFormField label="Name" help="Some help text" ids={{ input: 'name' }}>
          <input id="name" />
        </CxFormField>
      )
      expect(screen.getByText('Some help text')).toHaveClass('form-help')
    })

    test('renders invalid feedback only when invalid and invalidFeedback are both set', () => {
      const { rerender } = render(
        <CxFormField label="Name" invalidFeedback="Required" ids={{ input: 'name' }}>
          <input id="name" />
        </CxFormField>
      )
      expect(screen.queryByText('Required')).toBeNull()

      rerender(
        <CxFormField label="Name" invalid invalidFeedback="Required" ids={{ input: 'name' }}>
          <input id="name" />
        </CxFormField>
      )
      expect(screen.getByText('Required')).toHaveClass('invalid-feedback')
    })

    test('renders valid feedback only when valid and validFeedback are both set', () => {
      render(
        <CxFormField label="Name" valid validFeedback="Looks good" ids={{ input: 'name' }}>
          <input id="name" />
        </CxFormField>
      )
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxFormField
          label="Email"
          help="We'll never share it."
          ids={{ input: 'email2', help: 'email2-help' }}
        >
          <input id="email2" aria-describedby="email2-help" />
        </CxFormField>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
