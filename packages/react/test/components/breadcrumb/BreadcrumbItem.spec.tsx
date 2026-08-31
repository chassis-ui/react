import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { BreadcrumbItem } from '../../../src/index'

describe('BreadcrumbItem', () => {
  describe('rendering', () => {
    test('renders a li with the base class and plain text when no href', () => {
      render(<BreadcrumbItem>Test</BreadcrumbItem>)
      const item = screen.getByText('Test')
      expect(item).toHaveClass('breadcrumb-item')
      expect(item.tagName).toBe('LI')
    })

    test('wraps children in a link when href is provided', () => {
      render(<BreadcrumbItem href="/bazinga">Test</BreadcrumbItem>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveAttribute('href', '/bazinga')
      expect(screen.getByRole('listitem')).toHaveClass('breadcrumb-item')
    })

    test('applies active class and aria-current on the li', () => {
      render(
        <BreadcrumbItem active={true} className="bazinga">
          Test
        </BreadcrumbItem>
      )
      const item = screen.getByRole('listitem')
      expect(item).toHaveClass('breadcrumb-item', 'active', 'bazinga')
      expect(item).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying li', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<BreadcrumbItem ref={ref}>Test</BreadcrumbItem>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ol>
          <BreadcrumbItem href="/bazinga">Test A</BreadcrumbItem>
          <BreadcrumbItem active>Test B</BreadcrumbItem>
        </ol>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
