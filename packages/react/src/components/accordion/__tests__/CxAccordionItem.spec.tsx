import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxAccordion, CxAccordionBody, CxAccordionHeader, CxAccordionItem } from '../../../index'

describe('CxAccordionItem', () => {
  describe('rendering', () => {
    test('renders a details with the base class and className merged', () => {
      const { container } = render(<CxAccordionItem className="bazinga">Test</CxAccordionItem>)
      expect(container.firstChild).toHaveClass('accordion-item', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DETAILS')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxAccordionItem>
          <CxAccordionHeader>Header</CxAccordionHeader>
          <CxAccordionBody>Body</CxAccordionBody>
        </CxAccordionItem>
      )
      expect(container).toMatchSnapshot()
    })

    test('starts open when the open prop is set', () => {
      const { container } = render(<CxAccordionItem open>Test</CxAccordionItem>)
      expect(container.querySelector('details')).toHaveAttribute('open')
    })
  })

  describe('group name behavior', () => {
    test('falls back to the accordion group name', () => {
      const { container } = render(
        <CxAccordion name="group-name">
          <CxAccordionItem>Test</CxAccordionItem>
        </CxAccordion>
      )
      expect(container.querySelector('details')).toHaveAttribute('name', 'group-name')
    })

    test('a local name overrides the accordion group name', () => {
      const { container } = render(
        <CxAccordion name="group-name">
          <CxAccordionItem name="item-name">Test</CxAccordionItem>
        </CxAccordion>
      )
      expect(container.querySelector('details')).toHaveAttribute('name', 'item-name')
    })

    test('alwaysOpen removes the shared name so the item opens independently', () => {
      const { container } = render(
        <CxAccordion name="group-name">
          <CxAccordionItem alwaysOpen>Test</CxAccordionItem>
        </CxAccordion>
      )
      expect(container.querySelector('details')).not.toHaveAttribute('name')
    })

    test("the accordion's alwaysOpen removes the name unless an item overrides it", () => {
      const { container } = render(
        <CxAccordion name="group-name" alwaysOpen>
          <CxAccordionItem>Test</CxAccordionItem>
          <CxAccordionItem alwaysOpen={false} name="solo">
            Test
          </CxAccordionItem>
        </CxAccordion>
      )
      const details = container.querySelectorAll('details')
      expect(details[0]).not.toHaveAttribute('name')
      expect(details[1]).toHaveAttribute('name', 'solo')
    })
  })

  describe('toggle behavior', () => {
    test('clicking the header toggles the native details element open and closed', async () => {
      const user = userEvent.setup()
      render(
        <CxAccordionItem>
          <CxAccordionHeader>Header</CxAccordionHeader>
          <CxAccordionBody>Body</CxAccordionBody>
        </CxAccordionItem>
      )
      const details = screen.getByText('Body').closest('details') as HTMLDetailsElement
      expect(details.open).toBe(false)

      await user.click(screen.getByText('Header'))
      expect(details.open).toBe(true)

      await user.click(screen.getByText('Header'))
      expect(details.open).toBe(false)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying details', () => {
      const ref = React.createRef<HTMLDetailsElement>()
      render(<CxAccordionItem ref={ref}>Test</CxAccordionItem>)
      expect(ref.current).toBeInstanceOf(HTMLDetailsElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxAccordionItem open>
          <CxAccordionHeader>Header</CxAccordionHeader>
          <CxAccordionBody>Body</CxAccordionBody>
        </CxAccordionItem>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
