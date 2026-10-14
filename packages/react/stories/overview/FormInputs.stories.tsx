import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../src/components/button/Button'
import { ChipInput } from '../../src/components/chip-input/ChipInput'
import { ColorInput } from '../../src/components/color-input/ColorInput'
import { FileInput } from '../../src/components/file-input/FileInput'
import { FloatingInput } from '../../src/components/floating-input/FloatingInput'
import { Icon } from '../../src/components/icon/Icon'
import { InputAdorn } from '../../src/components/input-adorn/InputAdorn'
import { InputGroup } from '../../src/components/input-group/InputGroup'
import { InputGroupAddon } from '../../src/components/input-group/InputGroupAddon'
import { OtpInput } from '../../src/components/otp-input/OtpInput'
import { PasswordStrength } from '../../src/components/password-strength/PasswordStrength'
import { Select } from '../../src/components/select/Select'
import { Textarea } from '../../src/components/textarea/Textarea'
import { TextInput } from '../../src/components/text-input/TextInput'

// One page of the text-entry form controls in their main states, for a single visual regression
// screenshot (`test/visual/overview-form-inputs.visual.spec.ts`). None of these components has
// styles of its own: they apply `@chassis-ui/css` classes, so what can move them is a change to
// chassis-css, and one screenshot of all of them side by side catches it (#45). A component that
// gains styles or runtime layout of its own gets a per-story spec instead.
//
// The page has a fixed width, so the screenshot doesn't depend on the viewport, and no story-level
// state: every value is a default, nothing takes focus.
const meta: Meta = {
  title: 'overview/Form inputs',
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

const options = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' },
  { label: 'Three', value: '3' }
]

export const Default: Story = {
  render: () => (
    <div style={PAGE}>
      <Section title="TextInput">
        <TextInput label="Name" help="Enter your full name" placeholder="Jane Doe" />
        <TextInput label="Filled" defaultValue="Jane Doe" />
        <TextInput
          label="Email address"
          defaultValue="jane@"
          invalid
          invalidFeedback="Please enter a valid email address."
        />
        <TextInput
          label="Username"
          defaultValue="jane"
          valid
          validFeedback="That name is available."
        />
        <TextInput label="Read-only" defaultValue="Read-only input" readOnly />
        <TextInput label="Disabled" placeholder="Disabled input" disabled />
        <TextInput aria-label="Small text input" size="sm" placeholder="Small" />
        <TextInput aria-label="Large text input" size="lg" placeholder="Large" />
      </Section>

      <Section title="Textarea">
        <Textarea label="Bio" help="A short description" placeholder="About you" rows={3} />
        <Textarea
          label="Invalid"
          defaultValue="Too long"
          invalid
          invalidFeedback="Bio must be under 200 characters."
          rows={2}
        />
        <Textarea label="Disabled" placeholder="Disabled textarea" disabled rows={2} />
      </Section>

      <Section title="Select">
        <Select label="Country" help="Used to calculate shipping costs." options={options} />
        <Select
          label="Invalid"
          placeholder="Choose an option"
          options={options}
          invalid
          invalidFeedback="Please choose an option."
        />
        <Select label="Disabled" placeholder="Choose an option" options={options} disabled />
        <Select aria-label="Small select" size="sm" options={options} />
        <Select aria-label="Large select" size="lg" options={options} />
        <Select
          aria-label="Multiple select"
          multiple
          options={[
            { label: 'One', value: '1' },
            { label: 'Two', value: '2', selected: true },
            { label: 'Three', value: '3', selected: true }
          ]}
        />
      </Section>

      <Section title="FileInput and ColorInput">
        <FileInput label="Attachment" />
        <FileInput label="Invalid" invalid invalidFeedback="Choose a file." />
        <FileInput label="Disabled" disabled />
        <FileInput aria-label="Small file input" size="sm" />
        <FileInput aria-label="Large file input" size="lg" />
        <ColorInput label="Accent color" defaultValue="#0d6efd" />
        <ColorInput aria-label="Small color input" defaultValue="#198754" size="sm" />
        <ColorInput aria-label="Large color input" defaultValue="#dc3545" size="lg" />
        <ColorInput aria-label="Disabled color input" defaultValue="#6c757d" disabled />
      </Section>

      <Section title="OtpInput">
        <OtpInput aria-label="Verification code" length={6} />
        <OtpInput aria-label="Grouped code" defaultValue="123" groupSizes={[3, 3]} inputGroup />
        <OtpInput aria-label="Masked code" defaultValue="123" inputGroup mask />
        <OtpInput aria-label="Verified code" defaultValue="123456" inputGroup valid />
        <OtpInput aria-label="Invalid code" defaultValue="123" inputGroup invalid />
        <OtpInput aria-label="Disabled code" defaultValue="123" inputGroup disabled />
      </Section>

      <Section title="ChipInput">
        <ChipInput
          label="Skills"
          help="Press Enter or , to add a skill."
          chipVariant="primary smooth"
          defaultValue={['React', 'TypeScript']}
          placeholder="Add skill…"
        />
        <ChipInput
          aria-label="Issue labels"
          chipVariant="danger"
          defaultValue={['Bug', 'Critical']}
          placeholder="Add label…"
        />
        <ChipInput aria-label="Disabled chips" defaultValue={['React', 'CSS']} disabled />
      </Section>

      <Section title="PasswordStrength">
        <PasswordStrength aria-label="Weak example" value="abc" />
        <PasswordStrength aria-label="Fair example" value="abcdefgh1" />
        <PasswordStrength aria-label="Good example" value="Abcdefgh1234" />
        <PasswordStrength aria-label="Strong example" value="Sup3r!Secret!Passphrase99" />
        <PasswordStrength aria-label="Bar example" value="Abcdefgh1234" variant="bar" />
      </Section>

      <Section title="FloatingInput">
        <FloatingInput label="Email address">
          <TextInput type="email" placeholder="name@example.com" />
        </FloatingInput>
        <FloatingInput label="With a value" help="We'll never share your email.">
          <TextInput type="email" placeholder="name@example.com" defaultValue="jane@example.com" />
        </FloatingInput>
        {/* `FloatingInput` never clones its child: the control takes `invalid` too. */}
        <FloatingInput label="Invalid" invalid invalidFeedback="Please enter an email address.">
          <TextInput type="email" placeholder="name@example.com" defaultValue="jane@" invalid />
        </FloatingInput>
        <FloatingInput label="Comments">
          <Textarea placeholder="Leave a comment here" />
        </FloatingInput>
        <FloatingInput label="Works with selects">
          <Select options={options} />
        </FloatingInput>
      </Section>

      <Section title="InputGroup">
        <InputGroup>
          <InputGroupAddon id="overview-username-addon">@</InputGroupAddon>
          <TextInput
            aria-label="Username"
            aria-describedby="overview-username-addon"
            placeholder="Username"
          />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>$</InputGroupAddon>
          <TextInput aria-label="Amount (to the nearest dollar)" />
          <InputGroupAddon>.00</InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <TextInput aria-label="Recipient's username" placeholder="Recipient's username" />
          <Button type="button" color="secondary" variant="outline">
            Button
          </Button>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>First and last name</InputGroupAddon>
          <TextInput aria-label="First name" />
          <TextInput aria-label="Last name" />
        </InputGroup>
        <InputGroup size="sm">
          <InputGroupAddon>Small</InputGroupAddon>
          <TextInput aria-label="Small input group" />
        </InputGroup>
        <InputGroup size="lg">
          <InputGroupAddon>Large</InputGroupAddon>
          <TextInput aria-label="Large input group" />
        </InputGroup>
      </Section>

      <Section title="InputAdorn">
        <TextInput
          aria-label="Search"
          placeholder="Search..."
          adornStart={
            <InputAdorn>
              <Icon name="search-outline" size={16} />
            </InputAdorn>
          }
        />
        <TextInput
          aria-label="Amount in dollars"
          placeholder="0.00"
          adornStart={<InputAdorn>$</InputAdorn>}
          adornEnd={<InputAdorn>USD</InputAdorn>}
        />
        <TextInput
          aria-label="Password"
          type="password"
          autoComplete="current-password"
          defaultValue="secret"
          adornEnd={
            <InputAdorn component="button" type="button" aria-label="Show password">
              <Icon name="eye-outline" size={16} />
            </InputAdorn>
          }
        />
      </Section>
    </div>
  )
}
