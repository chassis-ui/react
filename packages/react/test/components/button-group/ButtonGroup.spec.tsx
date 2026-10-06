import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ButtonGroup, Button } from '../../../src/index'

describe('ButtonGroup', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<ButtonGroup>Test</ButtonGroup>)
      const group = screen.getByText('Test')
      expect(group).toHaveClass('button-group')
      expect(group.tagName).toBe('DIV')
    })

    test('renders nested Buttons with their default class and type', () => {
      render(
        <ButtonGroup>
          <Button>A</Button>
          <Button>B</Button>
          <Button>C</Button>
        </ButtonGroup>
      )
      const button = screen.getByRole('button', { name: 'A' })
      expect(button).toHaveClass('button', 'primary')
      expect(button).toHaveAttribute('type', 'button')
    })

    // The group wrapper has no default role (only when a caller passes one explicitly, as the
    // accessibility test below does), so its only queryable ancestor is the button's parent
    // element.
    /* eslint-disable testing-library/no-node-access */
    test('applies the size class with className', () => {
      render(
        <ButtonGroup className="bazinga" size="lg">
          <Button>A</Button>
        </ButtonGroup>
      )
      expect(screen.getByRole('button', { name: 'A' }).parentElement?.className).toBe(
        'button-group lg bazinga'
      )
    })

    // chassis-css has no `.button-group.vertical`: a vertical group is `.button-group-vertical`,
    // without `.button-group`, whose rules for a row (overlapping borders, corners) would apply.
    test('renders button-group-vertical in place of button-group when vertical', () => {
      render(
        <ButtonGroup className="bazinga" vertical>
          <Button>A</Button>
        </ButtonGroup>
      )
      const group = screen.getByRole('button', { name: 'A' }).parentElement
      expect(group?.className).toBe('button-group-vertical bazinga')
      expect(group).not.toHaveClass('button-group', 'vertical')
    })
    /* eslint-enable testing-library/no-node-access */
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ButtonGroup ref={ref}>Test</ButtonGroup>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ButtonGroup role="group" aria-label="Actions">
          <Button>A</Button>
          <Button>B</Button>
        </ButtonGroup>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
