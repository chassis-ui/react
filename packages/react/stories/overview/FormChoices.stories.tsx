import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../src/components/button/Button'
import { Checkbox } from '../../src/components/checkbox/Checkbox'
import { CheckboxGroup } from '../../src/components/checkbox/CheckboxGroup'
import { Form } from '../../src/components/form/Form'
import { FormHelp } from '../../src/components/form/FormHelp'
import { FormLabel } from '../../src/components/form/FormLabel'
import { FormField } from '../../src/components/form-field/FormField'
import { InputGroup } from '../../src/components/input-group/InputGroup'
import { InputGroupAddon } from '../../src/components/input-group/InputGroupAddon'
import { Radio } from '../../src/components/radio/Radio'
import { RadioGroup } from '../../src/components/radio/RadioGroup'
import { RangeInput } from '../../src/components/range-input/RangeInput'
import { Switch } from '../../src/components/switch/Switch'
import { TextInput } from '../../src/components/text-input/TextInput'

// One page of the choice controls and the form scaffolding in their main states, for a single
// visual regression screenshot (`test/visual/overview-form-choices.visual.spec.ts`). None of these
// components has styles of its own: they apply `@chassis-ui/css` classes, so what can move them is
// a change to chassis-css, and one screenshot of all of them side by side catches it (#45). A
// component that gains styles or runtime layout of its own gets a per-story spec instead.
//
// The page has a fixed width, so the screenshot doesn't depend on the viewport, and no story-level
// state: every value is a default, nothing takes focus.
const meta: Meta = {
  title: 'overview/Form choices and fields',
  tags: ['!autodocs']
}

export default meta

type Story = StoryObj

const PAGE: React.CSSProperties = {
  display: 'grid',
  gap: '2rem 3rem',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  alignItems: 'start',
  width: 960
}

const STACK: React.CSSProperties = { display: 'grid', gap: '1rem' }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={STACK}>
      <h2 className="h6 mb-0">{title}</h2>
      {children}
    </section>
  )
}

export const Default: Story = {
  render: () => (
    <div style={PAGE}>
      <Section title="Checkbox">
        <div>
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultSelected />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Success color" color="success" defaultSelected />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled checked" defaultSelected disabled />
          <Checkbox label="Valid" valid defaultSelected />
          <Checkbox label="Invalid" invalid />
        </div>
        <div>
          <Checkbox label="Small" size="sm" defaultSelected />
          <Checkbox label="Large" size="lg" defaultSelected />
        </div>
        <CheckboxGroup
          label="Notifications"
          description="Choose which notifications you'd like to receive."
          defaultValue={['email']}
        >
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
        <CheckboxGroup label="Terms" invalid errorMessage="Accept the terms to continue.">
          <Checkbox value="terms" label="I accept the terms" />
        </CheckboxGroup>
        <div className="d-flex gap-xs">
          <Checkbox label="Toggle on" button={{ color: 'primary' }} defaultSelected />
          <Checkbox label="Toggle off" button={{ color: 'primary' }} />
        </div>
      </Section>

      <Section title="Radio">
        <RadioGroup label="Choose an option" defaultValue="checked">
          <Radio value="default" label="Default radio" />
          <Radio value="checked" label="Checked radio" />
          <Radio value="disabled" label="Disabled radio" disabled />
        </RadioGroup>
        <RadioGroup label="Colored and sized" defaultValue="lg">
          <Radio value="sm" label="Small" size="sm" color="success" />
          <Radio value="lg" label="Large" size="lg" color="success" />
        </RadioGroup>
        <RadioGroup label="Horizontal" defaultValue="one" orientation="horizontal">
          <Radio value="one" label="One" />
          <Radio value="two" label="Two" />
          <Radio value="three" label="Three" />
        </RadioGroup>
        <RadioGroup label="Select a plan" invalid errorMessage="Please choose a plan to continue.">
          <Radio value="basic" label="Basic" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
        <RadioGroup aria-label="Toggle buttons" defaultValue="checked" orientation="horizontal">
          <Radio button={{ color: 'secondary' }} value="checked" label="Checked" />
          <Radio button={{ color: 'secondary' }} value="radio" label="Radio" />
          <Radio button={{ color: 'secondary' }} value="disabled" label="Disabled" disabled />
        </RadioGroup>
      </Section>

      <Section title="Switch">
        <div>
          <Switch label="Off" />
          <Switch label="On" defaultSelected />
          <Switch label="Danger color" color="danger" defaultSelected />
          <Switch label="Disabled" disabled />
          <Switch label="Disabled on" defaultSelected disabled />
          <Switch label="Invalid" invalid />
        </div>
        <div>
          <Switch label="Small" size="sm" defaultSelected />
          <Switch label="Large" size="lg" defaultSelected />
        </div>
      </Section>

      <Section title="RangeInput">
        <RangeInput label="Volume" help="From 0 to 100." defaultValue="25" />
        <RangeInput label="Steps" min={0} max={5} step={0.5} defaultValue="3" />
        <RangeInput label="Invalid" defaultValue="90" invalid invalidFeedback="Too loud." />
        <RangeInput label="Disabled" defaultValue="50" disabled />
      </Section>

      <Section title="FormField">
        <FormField
          label="Coupon code"
          help="One code per order."
          ids={{ help: 'ovCouponHelp', input: 'ovCoupon', label: 'ovCouponLabel' }}
        >
          <InputGroup>
            <TextInput
              aria-describedby="ovCouponHelp"
              aria-labelledby="ovCouponLabel"
              id="ovCoupon"
            />
            <Button color="secondary" type="button" variant="outline">
              Apply
            </Button>
          </InputGroup>
        </FormField>
        <FormField
          label="Username"
          invalid
          invalidFeedback="This username is already taken."
          ids={{ feedback: 'ovUsernameFeedback', input: 'ovUsername', label: 'ovUsernameLabel' }}
        >
          <InputGroup>
            <InputGroupAddon>@</InputGroupAddon>
            <TextInput
              aria-describedby="ovUsernameFeedback"
              aria-labelledby="ovUsernameLabel"
              defaultValue="chassis"
              id="ovUsername"
              invalid
            />
          </InputGroup>
        </FormField>
        <FormField
          label="Handle"
          valid
          validFeedback="That handle is free."
          ids={{ feedback: 'ovHandleFeedback', input: 'ovHandle', label: 'ovHandleLabel' }}
        >
          <TextInput
            aria-describedby="ovHandleFeedback"
            aria-labelledby="ovHandleLabel"
            defaultValue="chassis-ui"
            id="ovHandle"
            valid
          />
        </FormField>
      </Section>

      <Section title="Form">
        <Form>
          <div style={STACK}>
            <TextInput label="Email address" help="We'll never share your email." type="email" />
            <div>
              <FormLabel htmlFor="ovPassword" id="ovPasswordLabel">
                Password
              </FormLabel>
              <TextInput
                aria-describedby="ovPasswordHelp"
                aria-labelledby="ovPasswordLabel"
                id="ovPassword"
                type="password"
              />
              <FormHelp id="ovPasswordHelp">Must be 8-20 characters long.</FormHelp>
            </div>
          </div>
        </Form>
        <Form>
          <fieldset disabled style={STACK}>
            <legend className="h6 mb-0">Disabled fieldset</legend>
            <TextInput label="Disabled input" placeholder="Disabled input" />
            <Checkbox label="Can't check this" />
            <div>
              <Button type="submit">Submit</Button>
            </div>
          </fieldset>
        </Form>
      </Section>
    </div>
  )
}
