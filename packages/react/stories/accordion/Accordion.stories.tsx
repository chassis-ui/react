import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Accordion } from '../../src/components/accordion/Accordion'
import { AccordionItem } from '../../src/components/accordion/AccordionItem'
import { AccordionHeader } from '../../src/components/accordion/AccordionHeader'
import { AccordionBody } from '../../src/components/accordion/AccordionBody'

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  title: 'accordion/Accordion'
}
export default meta

type Story = StoryObj<typeof Accordion>

// chassis-css only wires up the expand/collapse transition when the `.accordion` element carries
// a `data-cx-accordion` attribute (see chassis-css's `_accordion.scss`, `&[data-cx-accordion] >
// details`) — a hook meant for chassis-css's own vanilla-JS accordion.js. `Accordion.tsx` never
// sets that attribute (it relies on the native <details> element's own open/close, no JS-driven
// height animation), so every story below renders its open/closed state instantly on first paint
// — no transition to settle before screenshotting, unlike Collapse (below) or Toast/Notification.
const items = (openIndex?: number) => (
  <>
    <AccordionItem open={openIndex === 0}>
      <AccordionHeader>Accordion Item #1</AccordionHeader>
      <AccordionBody>
        <strong>This is the first item&apos;s accordion body.</strong> Just about any HTML can go
        within the <code>.accordion-body</code>.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem open={openIndex === 1}>
      <AccordionHeader>Accordion Item #2</AccordionHeader>
      <AccordionBody>
        <strong>This is the second item&apos;s accordion body.</strong> It is hidden by default.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem open={openIndex === 2}>
      <AccordionHeader>Accordion Item #3</AccordionHeader>
      <AccordionBody>
        <strong>This is the third item&apos;s accordion body.</strong> It is hidden by default.
      </AccordionBody>
    </AccordionItem>
  </>
)

export const Closed: Story = {
  args: {
    name: 'closed-example',
    children: items()
  }
}

export const Open: Story = {
  args: {
    name: 'open-example',
    children: items(0)
  }
}

export const Flush: Story = {
  args: {
    name: 'flush-example',
    flush: true,
    children: items(0)
  }
}

export const CaretEnd: Story = {
  args: {
    name: 'caret-end-example',
    caretEnd: true,
    children: items(0)
  }
}

// `alwaysOpen` lets more than one item stay open at once — the item-level `open` prop on each
// <details> is independent, so both render expanded simultaneously rather than one closing when
// the other opens.
export const AlwaysOpen: Story = {
  args: {
    name: 'always-open-example',
    alwaysOpen: true,
    children: (
      <>
        <AccordionItem open>
          <AccordionHeader>Accordion Item #1</AccordionHeader>
          <AccordionBody>Both items here stay open at once.</AccordionBody>
        </AccordionItem>
        <AccordionItem open>
          <AccordionHeader>Accordion Item #2</AccordionHeader>
          <AccordionBody>This item is also open.</AccordionBody>
        </AccordionItem>
      </>
    )
  }
}
