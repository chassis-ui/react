import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card, CardBody, CardHeader, CardImage } from '../../../src/index'

describe('Card', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<Card>Test</Card>)
      const card = screen.getByText('Test')
      expect(card).toHaveClass('card')
      expect(card.tagName).toBe('DIV')
    })

    test('renders as a custom component', () => {
      render(
        <Card className="bazinga" component="section">
          Test
        </Card>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass('card', 'bazinga')
      expect(el.tagName).toBe('SECTION')
    })
  })

  describe('styling props', () => {
    test('applies color, variant and className together', () => {
      render(
        <Card className="bazinga" color="primary" variant="solid">
          Test
        </Card>
      )
      expect(screen.getByText('Test')).toHaveClass('card', 'context', 'primary', 'solid', 'bazinga')
    })

    test('applies size as a class', () => {
      render(<Card size="large">Test</Card>)
      expect(screen.getByText('Test')).toHaveClass('card', 'large')
    })

    test('applies direction and responsive as classes', () => {
      render(
        <Card direction="row" responsive={{ large: 'column' }}>
          Test
        </Card>
      )
      expect(screen.getByText('Test')).toHaveClass('card', 'flex-row', 'large:flex-column')
    })
  })

  describe('shorthand props', () => {
    test('composes title, subtitle, text and children into a single CardBody, in order', () => {
      const { container } = render(
        <Card title="Card title" subtitle="Card subtitle" text="Some text">
          <button type="button">Go somewhere</button>
        </Card>
      )
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const body = container.querySelector('.card-body')
      expect(body).not.toBeNull()
      // eslint-disable-next-line testing-library/no-node-access
      const bodyChildren = body?.children ?? []
      expect(bodyChildren).toHaveLength(4)
      expect(bodyChildren[0]).toHaveClass('card-title')
      expect(bodyChildren[0]).toHaveTextContent('Card title')
      expect(bodyChildren[1]).toHaveClass('card-subtitle')
      expect(bodyChildren[1]).toHaveTextContent('Card subtitle')
      expect(bodyChildren[2]).toHaveClass('card-text')
      expect(bodyChildren[2]).toHaveTextContent('Some text')
      expect(bodyChildren[3]?.tagName).toBe('BUTTON')
    })

    test('renders image before the body by default, and after it when imageOrientation is bottom', () => {
      const { container: top } = render(
        <Card image="/hero.jpg" imageAlt="Hero" title="Card title" />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const topChildren = Array.from(top.firstElementChild?.children ?? [])
      expect(topChildren[0]).toHaveClass('card-image-top')
      expect(topChildren[0]).toHaveAttribute('alt', 'Hero')
      expect(topChildren[1]).toHaveClass('card-body')

      const { container: bottom } = render(
        <Card image="/hero.jpg" imageOrientation="bottom" title="Card title" />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const bottomChildren = Array.from(bottom.firstElementChild?.children ?? [])
      expect(bottomChildren[0]).toHaveClass('card-body')
      expect(bottomChildren[1]).toHaveClass('card-image-bottom')
    })

    test('renders a non-string image as-is, alongside other shorthand props', () => {
      render(
        <Card
          image={<CardImage orientation="top" component="div" aria-label="Loading image" />}
          title="Card title"
        />
      )
      expect(screen.getByLabelText('Loading image')).toHaveClass('card-image-top')
      expect(screen.getByText('Card title')).toHaveClass('card-title')
    })

    test('renders footer after the body', () => {
      render(
        <Card title="Card title" footer="Card footer">
          Test
        </Card>
      )
      const footer = screen.getByText('Card footer')
      expect(footer).toHaveClass('card-footer')
    })

    test('renders an image-only card with no CardBody when no body content is set', () => {
      const { container } = render(<Card image="/hero.jpg" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.card-body')).toBeNull()
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.card-image-top')).not.toBeNull()
    })

    test('renders children as-is (no auto CardBody) when no shorthand prop is set', () => {
      render(
        <Card>
          <CardHeader>Header</CardHeader>
          <CardBody>Body</CardBody>
        </Card>
      )
      expect(screen.getByText('Header')).toHaveClass('card-header')
      expect(screen.getByText('Body')).toHaveClass('card-body')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card ref={ref}>Test</Card>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card>Test</Card>)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations when composed from shorthand props', async () => {
      const { container } = render(
        <Card
          image="/hero.jpg"
          imageAlt="Hero"
          title="Card title"
          text="Some text"
          footer="Footer"
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
