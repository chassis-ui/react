import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { CxFormRadio, CxFormRadioGroup } from '../../../index'

test('loads and displays CxFormRadioGroup component', async () => {
  const { container } = render(
    <CxFormRadioGroup label="Choose an option" defaultValue="a">
      <CxFormRadio value="a" label="Option A" />
      <CxFormRadio value="b" label="Option B" />
    </CxFormRadioGroup>
  )
  expect(container).toMatchSnapshot()
})

test('renders a fieldset/legend wired up with the group role and description', () => {
  render(
    <CxFormRadioGroup label="Choose an option" description="Pick one." defaultValue="a">
      <CxFormRadio value="a" label="Option A" />
    </CxFormRadioGroup>
  )
  const group = screen.getByRole('radiogroup', { name: 'Choose an option' })
  expect(group.tagName).toBe('FIELDSET')
  expect(screen.getByText('Choose an option').tagName).toBe('LEGEND')
  expect(group).toHaveAccessibleDescription('Pick one.')
})

test('invalid group renders the error message and is-invalid class', () => {
  render(
    <CxFormRadioGroup label="Choose an option" invalid errorMessage="Pick one to continue.">
      <CxFormRadio value="a" label="Option A" />
    </CxFormRadioGroup>
  )
  expect(screen.getByText('Pick one to continue.')).toHaveClass('invalid-feedback')
  expect(screen.getByRole('radiogroup')).toHaveClass('is-invalid')
})

test('orientation="horizontal" wraps items in a flex row', () => {
  render(
    <CxFormRadioGroup label="Choose an option" defaultValue="a" orientation="horizontal">
      <CxFormRadio value="a" label="Option A" />
      <CxFormRadio value="b" label="Option B" />
    </CxFormRadioGroup>
  )
  const radioA = screen.getByRole('radio', { name: 'Option A' })
  expect(radioA.closest('.d-flex')).not.toBeNull()
})
