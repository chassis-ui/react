import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { FormField } from '../../../src/index'

describe('FormField', () => {
  describe('rendering', () => {
    test('renders children bare when no label/help/feedback are set', () => {
      // Asserting the absence of a wrapper with only a class, and that the input is the
      // container's direct child with no wrapper at all - neither has an accessible query.
      const { container } = render(
        <FormField>
          <input aria-label="Name" />
        </FormField>
      )
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toBe(screen.getByRole('textbox', { name: 'Name' }))
    })

    test('renders the .form-field wrapper and a label associated via htmlFor', () => {
      const { container } = render(
        <FormField label="Name" ids={{ input: 'name' }}>
          <input id="name" />
        </FormField>
      )
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).not.toBeNull()
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('id', 'name')
      expect(screen.getByText('Name').tagName).toBe('LABEL')
      expect(screen.getByText('Name')).toHaveClass('form-label')
    })

    test('renders help text', () => {
      render(
        <FormField label="Name" help="Some help text" ids={{ input: 'name' }}>
          <input id="name" />
        </FormField>
      )
      expect(screen.getByText('Some help text')).toHaveClass('form-help')
    })

    test("the rendered help text's id matches the caller-supplied aria-describedby", () => {
      render(
        <FormField
          label="Email"
          help="We'll never share it."
          ids={{ input: 'email', help: 'email-help' }}
        >
          <input id="email" aria-describedby="email-help" />
        </FormField>
      )
      const input = screen.getByRole('textbox', { name: 'Email' })
      const help = screen.getByText("We'll never share it.")
      expect(input.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback only when invalid and invalidFeedback are both set', () => {
      const { rerender } = render(
        <FormField label="Name" invalidFeedback="Required" ids={{ input: 'name' }}>
          <input id="name" />
        </FormField>
      )
      expect(screen.queryByText('Required')).toBeNull()

      rerender(
        <FormField label="Name" invalid invalidFeedback="Required" ids={{ input: 'name' }}>
          <input id="name" />
        </FormField>
      )
      expect(screen.getByText('Required')).toHaveClass('invalid-feedback')
    })

    test('renders valid feedback only when valid and validFeedback are both set', () => {
      render(
        <FormField label="Name" valid validFeedback="Looks good" ids={{ input: 'name' }}>
          <input id="name" />
        </FormField>
      )
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <FormField
          label="Email"
          help="We'll never share it."
          ids={{ input: 'email2', help: 'email2-help' }}
        >
          <input id="email2" aria-describedby="email2-help" />
        </FormField>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('dev warnings', () => {
    test('warns when label is set but ids.input/ids.label are both missing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <FormField label="Name">
          <input aria-label="Name" />
        </FormField>
      )
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('`ids.input`/`ids.label`'))
      warnSpy.mockRestore()
    })

    test('does not warn when ids.input is provided', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <FormField label="Name" ids={{ input: 'name' }}>
          <input id="name" />
        </FormField>
      )
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    test('does not warn when label is not set', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <FormField>
          <input aria-label="Name" />
        </FormField>
      )
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })
  })
})
