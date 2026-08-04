import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../index'

describe('Card.Group', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Card.Group className="bazinga">Test</Card.Group>)
      const group = screen.getByText('Test')
      expect(group).toHaveClass('card-group', 'bazinga')
      expect(group.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot with nested cards', () => {
      const { container } = render(
        <Card.Group>
          <Card>
            <Card.Image component="svg">Image</Card.Image>
            <Card.Header>Header</Card.Header>
            <Card.Body>
              <Card.Title>Title</Card.Title>
              <Card.Subtitle>Subtitle</Card.Subtitle>
              <Card.Text>Text</Card.Text>
              <Card.Link href="/bazinga">Link</Card.Link>
            </Card.Body>
            <Card.Footer>Footer</Card.Footer>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
            </Card.Body>
          </Card>
        </Card.Group>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card.Group ref={ref}>Test</Card.Group>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card.Group>Test</Card.Group>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
