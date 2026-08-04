import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Breadcrumb } from '../../../index'

describe('Breadcrumb.Item', () => {
  describe('rendering', () => {
    test('renders a li with the base class and plain text when no href', () => {
      render(<Breadcrumb.Item>Test</Breadcrumb.Item>)
      const item = screen.getByText('Test')
      expect(item).toHaveClass('breadcrumb-item')
      expect(item.tagName).toBe('LI')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Breadcrumb.Item>Test</Breadcrumb.Item>)
      expect(container).toMatchSnapshot()
    })

    test('wraps children in a link when href is provided', () => {
      render(<Breadcrumb.Item href="/bazinga">Test</Breadcrumb.Item>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveAttribute('href', '/bazinga')
      expect(screen.getByRole('listitem')).toHaveClass('breadcrumb-item')
    })

    test('applies active class and aria-current on the li', () => {
      render(
        <Breadcrumb.Item active={true} className="bazinga">
          Test
        </Breadcrumb.Item>
      )
      const item = screen.getByRole('listitem')
      expect(item).toHaveClass('breadcrumb-item', 'active', 'bazinga')
      expect(item).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying li', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<Breadcrumb.Item ref={ref}>Test</Breadcrumb.Item>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ol>
          <Breadcrumb.Item href="/bazinga">Test A</Breadcrumb.Item>
          <Breadcrumb.Item active>Test B</Breadcrumb.Item>
        </ol>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
