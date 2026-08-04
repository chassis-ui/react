import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Accordion } from '../../../index'

describe('Accordion.Item', () => {
  describe('rendering', () => {
    test('renders a details with the base class and className merged', () => {
      render(<Accordion.Item className="bazinga">Test</Accordion.Item>)
      const item = screen.getByRole('group')
      expect(item).toHaveClass('accordion-item', 'bazinga')
      expect(item.tagName).toBe('DETAILS')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <Accordion.Item>
          <Accordion.Header>Header</Accordion.Header>
          <Accordion.Body>Body</Accordion.Body>
        </Accordion.Item>
      )
      expect(container).toMatchSnapshot()
    })

    test('starts open when the open prop is set', () => {
      render(<Accordion.Item open>Test</Accordion.Item>)
      expect(screen.getByRole('group')).toHaveAttribute('open')
    })
  })

  describe('group name behavior', () => {
    test('falls back to the accordion group name', () => {
      render(
        <Accordion name="group-name">
          <Accordion.Item>Test</Accordion.Item>
        </Accordion>
      )
      expect(screen.getByRole('group')).toHaveAttribute('name', 'group-name')
    })

    test('a local name overrides the accordion group name', () => {
      render(
        <Accordion name="group-name">
          <Accordion.Item name="item-name">Test</Accordion.Item>
        </Accordion>
      )
      expect(screen.getByRole('group')).toHaveAttribute('name', 'item-name')
    })

    test('alwaysOpen removes the shared name so the item opens independently', () => {
      render(
        <Accordion name="group-name">
          <Accordion.Item alwaysOpen>Test</Accordion.Item>
        </Accordion>
      )
      expect(screen.getByRole('group')).not.toHaveAttribute('name')
    })

    test("the accordion's alwaysOpen removes the name unless an item overrides it", () => {
      render(
        <Accordion name="group-name" alwaysOpen>
          <Accordion.Item>Test</Accordion.Item>
          <Accordion.Item alwaysOpen={false} name="solo">
            Test
          </Accordion.Item>
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
        <Accordion.Item>
          <Accordion.Header>Header</Accordion.Header>
          <Accordion.Body>Body</Accordion.Body>
        </Accordion.Item>
      )
      const details = screen.getByRole('group') as HTMLDetailsElement
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
      render(<Accordion.Item ref={ref}>Test</Accordion.Item>)
      expect(ref.current).toBeInstanceOf(HTMLDetailsElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Accordion.Item open>
          <Accordion.Header>Header</Accordion.Header>
          <Accordion.Body>Body</Accordion.Body>
        </Accordion.Item>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
