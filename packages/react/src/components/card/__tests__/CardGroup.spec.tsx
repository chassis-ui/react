import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  Card,
  CardImage,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  CardLink,
  CardFooter,
  CardGroup
} from '../../../index'

describe('CardGroup', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CardGroup className="bazinga">Test</CardGroup>)
      const group = screen.getByText('Test')
      expect(group).toHaveClass('card-group', 'bazinga')
      expect(group.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot with nested cards', () => {
      const { container } = render(
        <CardGroup>
          <Card>
            <CardImage component="svg">Image</CardImage>
            <CardHeader>Header</CardHeader>
            <CardBody>
              <CardTitle>Title</CardTitle>
              <CardSubtitle>Subtitle</CardSubtitle>
              <CardText>Text</CardText>
              <CardLink href="/bazinga">Link</CardLink>
            </CardBody>
            <CardFooter>Footer</CardFooter>
          </Card>
          <Card>
            <CardBody>
              <CardTitle>Card Title</CardTitle>
            </CardBody>
          </Card>
        </CardGroup>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardGroup ref={ref}>Test</CardGroup>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardGroup>Test</CardGroup>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
