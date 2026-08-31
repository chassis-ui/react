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

    test('applies size and vertical classes with className', () => {
      render(
        <ButtonGroup className="bazinga" size="large" vertical>
          <Button>A</Button>
        </ButtonGroup>
      )
      // The group wrapper has no default role (only when a caller passes one explicitly, as
      // the accessibility test below does), so its only queryable ancestor is the button's
      // parent element.
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('button', { name: 'A' }).parentElement).toHaveClass(
        'button-group',
        'large',
        'vertical',
        'bazinga'
      )
    })
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
