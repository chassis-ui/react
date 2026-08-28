import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from '../../../src/index'

describe('AccordionItem', () => {
  describe('rendering', () => {
    test('renders a details with the base class and className merged', () => {
      render(<AccordionItem className="bazinga">Test</AccordionItem>)
      const item = screen.getByRole('group')
      expect(item).toHaveClass('accordion-item', 'bazinga')
      expect(item.tagName).toBe('DETAILS')
    })

    test('renders a composed header and body with their expected classes', () => {
      render(
        <AccordionItem>
          <AccordionHeader>Header</AccordionHeader>
          <AccordionBody>Body</AccordionBody>
        </AccordionItem>
      )
      expect(screen.getByText('Header')).toHaveClass('accordion-title')
      expect(screen.getByText('Body')).toHaveClass('accordion-body')
    })

    test('starts open when the open prop is set', () => {
      render(<AccordionItem open>Test</AccordionItem>)
      expect(screen.getByRole('group')).toHaveAttribute('open')
    })
  })

  describe('group name behavior', () => {
    test('falls back to the accordion group name', () => {
      render(
        <Accordion name="group-name">
          <AccordionItem>Test</AccordionItem>
        </Accordion>
      )
      expect(screen.getByRole('group')).toHaveAttribute('name', 'group-name')
    })

    test('a local name overrides the accordion group name', () => {
      render(
        <Accordion name="group-name">
          <AccordionItem name="item-name">Test</AccordionItem>
        </Accordion>
      )
      expect(screen.getByRole('group')).toHaveAttribute('name', 'item-name')
    })

    test('alwaysOpen removes the shared name so the item opens independently', () => {
      render(
        <Accordion name="group-name">
          <AccordionItem alwaysOpen>Test</AccordionItem>
        </Accordion>
      )
      expect(screen.getByRole('group')).not.toHaveAttribute('name')
    })

    test("the accordion's alwaysOpen removes the name unless an item overrides it", () => {
      render(
        <Accordion name="group-name" alwaysOpen>
          <AccordionItem>Test</AccordionItem>
          <AccordionItem alwaysOpen={false} name="solo">
            Test
          </AccordionItem>
        </Accordion>
      )
      const details = screen.getAllByRole('group')
      expect(details[0]).not.toHaveAttribute('name')
      expect(details[1]).toHaveAttribute('name', 'solo')
    })
  })

  describe('toggle behavior', () => {
    test('clicking the header toggles the native details element open and closed', async () => {
      const user = userEvent.setup()
      render(
        <AccordionItem>
          <AccordionHeader>Header</AccordionHeader>
          <AccordionBody>Body</AccordionBody>
        </AccordionItem>
      )
      const details = screen.getByRole('group') as HTMLDetailsElement
      expect(details.open).toBe(false)

      await user.click(screen.getByText('Header'))
      expect(details.open).toBe(true)

      await user.click(screen.getByText('Header'))
      expect(details.open).toBe(false)
    })

    test('fires a caller-supplied onToggle when the item opens/closes - the only way to observe this uncontrolled state', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      render(
        <AccordionItem onToggle={onToggle}>
          <AccordionHeader>Header</AccordionHeader>
          <AccordionBody>Body</AccordionBody>
        </AccordionItem>
      )

      await user.click(screen.getByText('Header'))
      expect(onToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying details', () => {
      const ref = React.createRef<HTMLDetailsElement>()
      render(<AccordionItem ref={ref}>Test</AccordionItem>)
      expect(ref.current).toBeInstanceOf(HTMLDetailsElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <AccordionItem open>
          <AccordionHeader>Header</AccordionHeader>
          <AccordionBody>Body</AccordionBody>
        </AccordionItem>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('dev warnings', () => {
    test('warns when the deprecated itemKey prop is passed', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(<AccordionItem itemKey="a">Test</AccordionItem>)
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('itemKey prop is deprecated'))
      warnSpy.mockRestore()
    })

    test('does not warn when itemKey is omitted', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(<AccordionItem>Test</AccordionItem>)
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })
  })
})
