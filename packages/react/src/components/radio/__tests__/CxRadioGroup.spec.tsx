import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxRadio, CxRadioGroup } from '../../../index'

test('loads and displays CxRadioGroup component', async () => {
  const { container } = render(
    <CxRadioGroup label="Choose an option" defaultValue="a">
      <CxRadio value="a" label="Option A" />
      <CxRadio value="b" label="Option B" />
    </CxRadioGroup>
  )
  expect(container).toMatchSnapshot()
})

test('renders a fieldset/legend wired up with the group role and description', () => {
  render(
    <CxRadioGroup label="Choose an option" description="Pick one." defaultValue="a">
      <CxRadio value="a" label="Option A" />
    </CxRadioGroup>
  )
  const group = screen.getByRole('radiogroup', { name: 'Choose an option' })
  expect(group.tagName).toBe('FIELDSET')
  expect(screen.getByText('Choose an option').tagName).toBe('LEGEND')
  expect(group).toHaveAccessibleDescription('Pick one.')
})

test('invalid group renders the error message and is-invalid class', () => {
  render(
    <CxRadioGroup label="Choose an option" invalid errorMessage="Pick one to continue.">
      <CxRadio value="a" label="Option A" />
    </CxRadioGroup>
  )
  expect(screen.getByText('Pick one to continue.')).toHaveClass('invalid-feedback')
  expect(screen.getByRole('radiogroup')).toHaveClass('is-invalid')
})

test('orientation="horizontal" wraps items in a flex row', () => {
  render(
    <CxRadioGroup label="Choose an option" defaultValue="a" orientation="horizontal">
      <CxRadio value="a" label="Option A" />
      <CxRadio value="b" label="Option B" />
    </CxRadioGroup>
  )
  const radioA = screen.getByRole('radio', { name: 'Option A' })
  expect(radioA.closest('.d-flex')).not.toBeNull()
})

test('forwards a ref to the underlying fieldset', () => {
  const ref = React.createRef<HTMLFieldSetElement>()
  render(
    <CxRadioGroup ref={ref} label="Choose an option" defaultValue="a">
      <CxRadio value="a" label="Option A" />
    </CxRadioGroup>
  )
  expect(ref.current).toBeInstanceOf(HTMLFieldSetElement)
})

test('has no axe violations', async () => {
  const { container } = render(
    <CxRadioGroup label="Choose an option" description="Pick one." defaultValue="a">
      <CxRadio value="a" label="Option A" />
      <CxRadio value="b" label="Option B" />
    </CxRadioGroup>
  )
  expect(await axe(container)).toHaveNoViolations()
})
