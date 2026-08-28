import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CardLink } from '../../../src/index'

describe('CardLink', () => {
  describe('rendering', () => {
    test('renders an anchor with the base class and href', () => {
      render(
        <CardLink className="bazinga" href="/bazinga">
          Test
        </CardLink>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('card-link', 'bazinga')
      expect(link).toHaveAttribute('href', '/bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <CardLink ref={ref} href="/bazinga">
          Test
        </CardLink>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardLink href="/bazinga">Test</CardLink>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
