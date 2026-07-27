import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardLink } from '../../../index'

describe('CxCardLink', () => {
  describe('rendering', () => {
    test('renders an anchor with the base class and href', () => {
      render(
        <CxCardLink className="bazinga" href="/bazinga">
          Test
        </CxCardLink>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('card-link', 'bazinga')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCardLink href="/bazinga">Test</CxCardLink>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <CxCardLink ref={ref} href="/bazinga">
          Test
        </CxCardLink>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardLink href="/bazinga">Test</CxCardLink>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
