import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxBreadcrumbItem } from '../../../index'

describe('CxBreadcrumbItem', () => {
  describe('rendering', () => {
    test('renders a li with the base class and plain text when no href', () => {
      const { container } = render(<CxBreadcrumbItem>Test</CxBreadcrumbItem>)
      expect(container.firstChild).toHaveClass('breadcrumb-item')
      expect(container.firstChild?.nodeName).toBe('LI')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxBreadcrumbItem>Test</CxBreadcrumbItem>)
      expect(container).toMatchSnapshot()
    })

    test('wraps children in a CxLink when href is provided', () => {
      render(<CxBreadcrumbItem href="/bazinga">Test</CxBreadcrumbItem>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveAttribute('href', '/bazinga')
      expect(link.closest('li')).toHaveClass('breadcrumb-item')
    })

    test('applies active class and aria-current on the li', () => {
      const { container } = render(
        <CxBreadcrumbItem active={true} className="bazinga">
          Test
        </CxBreadcrumbItem>
      )
      expect(container.firstChild).toHaveClass('breadcrumb-item', 'active', 'bazinga')
      expect(container.firstChild).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying li', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<CxBreadcrumbItem ref={ref}>Test</CxBreadcrumbItem>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ol>
          <CxBreadcrumbItem href="/bazinga">Test A</CxBreadcrumbItem>
          <CxBreadcrumbItem active>Test B</CxBreadcrumbItem>
        </ol>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
