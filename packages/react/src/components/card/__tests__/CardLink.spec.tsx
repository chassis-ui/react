import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../index'

describe('Card.Link', () => {
  describe('rendering', () => {
    test('renders an anchor with the base class and href', () => {
      render(
        <Card.Link className="bazinga" href="/bazinga">
          Test
        </Card.Link>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('card-link', 'bazinga')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Card.Link href="/bazinga">Test</Card.Link>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <Card.Link ref={ref} href="/bazinga">
          Test
        </Card.Link>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card.Link href="/bazinga">Test</Card.Link>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
