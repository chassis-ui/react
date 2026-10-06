import React, { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { List } from '../../src/components/list/List'
import { ListItem } from '../../src/components/list/ListItem'
import { Menu } from '../../src/components/menu/Menu'
import { MenuItem } from '../../src/components/menu/MenuItem'
import { MenuList } from '../../src/components/menu/MenuList'
import { MenuToggle } from '../../src/components/menu/MenuToggle'
import { Nav } from '../../src/components/nav/Nav'
import { NavItem } from '../../src/components/nav/NavItem'
import { NavLink } from '../../src/components/nav/NavLink'
import { Scrollspy, ScrollspyProps } from '../../src/components/scrollspy/Scrollspy'

const meta: Meta<typeof Scrollspy> = {
  component: Scrollspy,
  title: 'scrollspy/Scrollspy'
}

export default meta

type Story = StoryObj<typeof Scrollspy>

const TEXT =
  'This is some placeholder content for the scrollspy example. As the box scrolls, the link ' +
  'to the section being read is marked. It is repeated in every section, so that each one ' +
  'takes more than the box can show at once.'

// A box of fixed height that scrolls, holding the sections.
function Box({
  boxRef,
  children
}: {
  boxRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}) {
  return (
    <div
      ref={boxRef}
      data-testid="box"
      tabIndex={0}
      className="p-md"
      style={{ height: 200, overflowY: 'auto', position: 'relative' }}
    >
      {children}
    </div>
  )
}

// Taller than the box whatever the text wraps to. Left to the text, a section was 152px at the
// width of the browser tests, 2px past the activation line (75% of the box, 150px).
const section = (id: string, title: string, Heading: 'h4' | 'h5' = 'h4') => (
  <div key={id} id={id} style={{ minHeight: 240 }}>
    <Heading>{title}</Heading>
    <p>{TEXT}</p>
    <p>{TEXT}</p>
  </div>
)

// Scrolls the box so that the section's top is at the box's top.
function scrollToSection(box: HTMLElement, id: string) {
  const target = box.querySelector<HTMLElement>(`#${id}`) as HTMLElement
  box.scrollTop +=
    target.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientTop
}

const current = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('[aria-current="true"]')].map((element) => element.textContent)

// The mark follows a scroll with the next frame the browser renders, which is when it reports
// the scroll and the intersections.
const waitForCurrent = (canvasElement: HTMLElement, texts: string[]) =>
  waitFor(() => expect(current(canvasElement)).toEqual(texts))

function NavExample(props: Omit<ScrollspyProps, 'root'>) {
  const box = useRef<HTMLDivElement>(null)
  return (
    <div className="d-flex gap-md">
      <Scrollspy root={box} {...props}>
        <Nav variant="segments" className="flex-column" style={{ minWidth: 140 }}>
          <NavItem href="#first">First</NavItem>
          <NavItem href="#second">Second</NavItem>
          <NavItem href="#third">Third</NavItem>
          <NavItem href="#fourth">Fourth</NavItem>
        </Nav>
      </Scrollspy>
      <Box boxRef={box}>
        {section('first', 'First heading')}
        {section('second', 'Second heading')}
        {section('third', 'Third heading')}
        {section('fourth', 'Fourth heading')}
      </Box>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <NavExample {...args} />,
  play: async function ({ canvas, canvasElement }) {
    const box = canvas.getByTestId('box')
    await waitForCurrent(canvasElement, ['First'])

    scrollToSection(box, 'third')
    await waitForCurrent(canvasElement, ['Third'])
    await expect(canvas.getByRole('link', { name: 'Third' })).toHaveClass('active')
    await expect(canvas.getByRole('link', { name: 'First' })).not.toHaveClass('active')

    // Back up, with the third section's top below the line again.
    scrollToSection(box, 'second')
    await waitForCurrent(canvasElement, ['Second'])

    // A jump straight to the end, past two sections.
    box.scrollTop = 0
    await waitForCurrent(canvasElement, ['First'])
    box.scrollTop = box.scrollHeight
    await waitForCurrent(canvasElement, ['Fourth'])
  }
}

export const SmoothScroll: Story = {
  render: (args) => <NavExample {...args} smoothScroll />,
  play: async function ({ canvas, canvasElement, userEvent }) {
    const box = canvas.getByTestId('box')
    await waitForCurrent(canvasElement, ['First'])

    await userEvent.click(canvas.getByRole('link', { name: 'Third' }))
    await waitForCurrent(canvasElement, ['Third'])
    const third = canvasElement.querySelector('#third') as HTMLElement
    await waitFor(() =>
      expect(
        Math.abs(third.getBoundingClientRect().top - box.getBoundingClientRect().top)
      ).toBeLessThan(2)
    )
    // The address didn't change.
    await expect(window.location.hash).not.toBe('#third')
  }
}

function NestedExample() {
  const box = useRef<HTMLDivElement>(null)
  return (
    <div className="d-flex gap-md">
      <Scrollspy root={box}>
        <Nav component="nav" variant="segments" className="flex-column" aria-label="Sections">
          <NavLink href="#item-1">Item 1</NavLink>
          <Nav component="nav" variant="segments" className="flex-column" aria-label="Item 1">
            <NavLink href="#item-1-1" className="ms-md">
              Item 1-1
            </NavLink>
            <NavLink href="#item-1-2" className="ms-md">
              Item 1-2
            </NavLink>
          </Nav>
          <NavLink href="#item-2">Item 2</NavLink>
        </Nav>
      </Scrollspy>
      <Box boxRef={box}>
        {section('item-1', 'Item 1')}
        {section('item-1-1', 'Item 1-1', 'h5')}
        {section('item-1-2', 'Item 1-2', 'h5')}
        {section('item-2', 'Item 2')}
      </Box>
    </div>
  )
}

export const Nested: Story = {
  render: () => <NestedExample />,
  play: async function ({ canvas, canvasElement }) {
    const box = canvas.getByTestId('box')
    await waitForCurrent(canvasElement, ['Item 1'])

    scrollToSection(box, 'item-1-2')
    await waitForCurrent(canvasElement, ['Item 1-2'])
    // The link the nested nav follows looks active, and isn't the current one.
    const parent = canvas.getByRole('link', { name: 'Item 1' })
    await expect(parent).toHaveClass('active')
    await expect(parent).not.toHaveAttribute('aria-current')

    scrollToSection(box, 'item-2')
    await waitForCurrent(canvasElement, ['Item 2'])
    await expect(parent).not.toHaveClass('active')
  }
}

function MenuExample() {
  const box = useRef<HTMLDivElement>(null)
  return (
    <>
      <Scrollspy root={box}>
        <Nav variant="segments" className="mb-md">
          <NavItem href="#first">First</NavItem>
          <NavItem href="#second">Second</NavItem>
          <Menu component="li" className="nav-item">
            <MenuToggle component={NavLink}>More</MenuToggle>
            <MenuList>
              <MenuItem href="#third">Third</MenuItem>
              <MenuItem href="#fourth">Fourth</MenuItem>
            </MenuList>
          </Menu>
        </Nav>
      </Scrollspy>
      <Box boxRef={box}>
        {section('first', 'First heading')}
        {section('second', 'Second heading')}
        {section('third', 'Third heading')}
        {section('fourth', 'Fourth heading')}
      </Box>
    </>
  )
}

export const WithMenu: Story = {
  render: () => <MenuExample />,
  play: async function ({ canvas, canvasElement }) {
    const box = canvas.getByTestId('box')
    const toggle = canvas.getByRole('button', { name: 'More' })
    await waitForCurrent(canvasElement, ['First'])
    await expect(toggle).not.toHaveClass('active')

    scrollToSection(box, 'fourth')
    await waitForCurrent(canvasElement, ['Fourth'])
    // The item is in the closed menu; its toggle looks active.
    await expect(toggle).toHaveClass('active')
  }
}

function ListExample() {
  const box = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)
  return (
    <div className="d-flex gap-md">
      <div style={{ minWidth: 140 }}>
        <Scrollspy root={box} onActiveChange={setActive}>
          <List>
            <ListItem href="#list-item-1">Item 1</ListItem>
            <ListItem href="#list-item-2">Item 2</ListItem>
            <ListItem href="#list-item-3">Item 3</ListItem>
          </List>
        </Scrollspy>
        <p className="mt-md" data-testid="reported">
          {active ?? 'none'}
        </p>
      </div>
      <Box boxRef={box}>
        {section('list-item-1', 'Item 1')}
        {section('list-item-2', 'Item 2')}
        {section('list-item-3', 'Item 3')}
      </Box>
    </div>
  )
}

export const WithList: Story = {
  render: () => <ListExample />,
  play: async function ({ canvas, canvasElement }) {
    const box = canvas.getByTestId('box')
    await waitForCurrent(canvasElement, ['Item 1'])
    await expect(canvas.getByTestId('reported')).toHaveTextContent('list-item-1')

    scrollToSection(box, 'list-item-2')
    await waitForCurrent(canvasElement, ['Item 2'])
    await expect(canvas.getByRole('link', { name: 'Item 2' })).toHaveClass('list-item', 'active')
    await expect(canvas.getByTestId('reported')).toHaveTextContent('list-item-2')
  }
}
