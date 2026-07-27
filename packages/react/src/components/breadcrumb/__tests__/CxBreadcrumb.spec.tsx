import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxBreadcrumb, CxBreadcrumbItem } from '../../../index'

describe('CxBreadcrumb', () => {
  describe('rendering', () => {
    test('renders a nav with an ol and the breadcrumb accessible name', () => {
      render(<CxBreadcrumb>Test</CxBreadcrumb>)
      const nav = screen.getByRole('navigation', { name: 'breadcrumb' })
      expect(nav.querySelector('ol')).toHaveClass('breadcrumb')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxBreadcrumb className="bazinga">
          <CxBreadcrumbItem>Test A</CxBreadcrumbItem>
          <CxBreadcrumbItem active={false}>Test B</CxBreadcrumbItem>
          <CxBreadcrumbItem active={true}>Test C</CxBreadcrumbItem>
        </CxBreadcrumb>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies className to the inner ol', () => {
      render(<CxBreadcrumb className="bazinga">Test</CxBreadcrumb>)
      const nav = screen.getByRole('navigation', { name: 'breadcrumb' })
      expect(nav.querySelector('ol')).toHaveClass('bazinga')
    })
  })

  describe('data-driven items', () => {
    test('renders items from the items prop, marking the last as active', () => {
      render(
        <CxBreadcrumb
          items={[{ label: 'Home', href: '#' }, { label: 'Library', href: '#' }, { label: 'Data' }]}
        />
      )

      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
      const current = screen.getByText('Data')
      expect(current.closest('li')).toHaveClass('active')
      expect(current.closest('li')).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying ol', () => {
      const ref = React.createRef<HTMLOListElement>()
      render(<CxBreadcrumb ref={ref}>Test</CxBreadcrumb>)
      expect(ref.current).toBeInstanceOf(HTMLOListElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxBreadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Data' }]} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
