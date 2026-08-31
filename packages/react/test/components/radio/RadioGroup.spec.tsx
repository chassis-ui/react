import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Radio, RadioGroup } from '../../../src/index'

describe('RadioGroup', () => {
  describe('rendering', () => {
    test('renders a fieldset/legend wired up with the group role and description', () => {
      render(
        <RadioGroup label="Choose an option" description="Pick one." defaultValue="a">
          <Radio value="a" label="Option A" />
        </RadioGroup>
      )
      const group = screen.getByRole('radiogroup', { name: 'Choose an option' })
      expect(group.tagName).toBe('FIELDSET')
      expect(group).toHaveClass('form-field')
      expect(group).toHaveAttribute('aria-orientation', 'vertical')
      const legend = screen.getByText('Choose an option')
      expect(legend.tagName).toBe('LEGEND')
      expect(legend).toHaveClass('form-label')
      expect(group).toHaveAccessibleDescription('Pick one.')
    })
  })

  describe('validation', () => {
    test('invalid group renders the error message and is-invalid class', () => {
      render(
        <RadioGroup label="Choose an option" invalid errorMessage="Pick one to continue.">
          <Radio value="a" label="Option A" />
        </RadioGroup>
      )
      expect(screen.getByText('Pick one to continue.')).toHaveClass('invalid-feedback')
      expect(screen.getByRole('radiogroup')).toHaveClass('is-invalid')
    })

    test('propagates invalid to every Radio item', () => {
      render(
        <RadioGroup label="Choose an option" invalid errorMessage="Pick one to continue.">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio', { name: 'Option A' })).toHaveClass('is-invalid')
      expect(screen.getByRole('radio', { name: 'Option B' })).toHaveClass('is-invalid')
    })

    test('propagates valid to every Radio item', () => {
      render(
        <RadioGroup label="Choose an option" valid>
          <Radio value="a" label="Option A" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio', { name: 'Option A' })).toHaveClass('is-valid')
    })
  })

  describe('orientation', () => {
    test('orientation="horizontal" wraps items in a flex row', () => {
      render(
        <RadioGroup label="Choose an option" defaultValue="a" orientation="horizontal">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      const radioA = screen.getByRole('radio', { name: 'Option A' })
      // The flex-row wrapper is a plain div with no role/name - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(radioA.closest('.d-flex')).not.toBeNull()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying fieldset', () => {
      const ref = React.createRef<HTMLFieldSetElement>()
      render(
        <RadioGroup ref={ref} label="Choose an option" defaultValue="a">
          <Radio value="a" label="Option A" />
        </RadioGroup>
      )
      expect(ref.current).toBeInstanceOf(HTMLFieldSetElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <RadioGroup label="Choose an option" description="Pick one." defaultValue="a">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
