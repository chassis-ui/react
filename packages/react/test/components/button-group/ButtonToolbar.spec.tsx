import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ButtonToolbar, ButtonGroup, Button } from '../../../src/index'

describe('ButtonToolbar', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<ButtonToolbar>Test</ButtonToolbar>)
      const toolbar = screen.getByText('Test')
      expect(toolbar).toHaveClass('button-toolbar')
      expect(toolbar.tagName).toBe('DIV')
    })

    test('forwards role and aria-label to the toolbar and nested groups, and renders nested buttons', () => {
      render(
        <ButtonToolbar role="group" aria-label="Bazinga">
          <ButtonGroup role="group">
            <Button>1</Button>
            <Button>2</Button>
          </ButtonGroup>
          <ButtonGroup role="group">
            <Button>A</Button>
            <Button>B</Button>
          </ButtonGroup>
        </ButtonToolbar>
      )
      const toolbar = screen.getByRole('group', { name: 'Bazinga' })
      expect(toolbar).toHaveClass('button-toolbar')
      expect(screen.getAllByRole('group')).toHaveLength(3)

      const button = screen.getByRole('button', { name: '1' })
      expect(button).toHaveClass('button', 'primary')
      expect(button).toHaveAttribute('type', 'button')
    })

    test('applies className', () => {
      render(<ButtonToolbar className="bazinga">Test</ButtonToolbar>)
      expect(screen.getByText('Test')).toHaveClass('button-toolbar', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ButtonToolbar ref={ref}>Test</ButtonToolbar>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ButtonToolbar role="group" aria-label="Bazinga">
          <ButtonGroup role="group" aria-label="First group">
            <Button>1</Button>
            <Button>2</Button>
          </ButtonGroup>
        </ButtonToolbar>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
