import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Breadcrumb, BreadcrumbItem, I18nProvider } from '../../../index'

describe('Breadcrumb', () => {
  describe('rendering', () => {
    test('renders a nav with an ol and the breadcrumb accessible name', () => {
      render(<Breadcrumb>Test</Breadcrumb>)
      expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
      expect(screen.getByRole('list')).toHaveClass('breadcrumb')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <Breadcrumb className="bazinga">
          <BreadcrumbItem>Test A</BreadcrumbItem>
          <BreadcrumbItem active={false}>Test B</BreadcrumbItem>
          <BreadcrumbItem active={true}>Test C</BreadcrumbItem>
        </Breadcrumb>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies className to the inner ol', () => {
      render(<Breadcrumb className="bazinga">Test</Breadcrumb>)
      expect(screen.getByRole('list')).toHaveClass('bazinga')
    })
  })

  describe('data-driven items', () => {
    test('renders items from the items prop, marking the last as active', () => {
      render(
        <Breadcrumb
          items={[{ label: 'Home', href: '#' }, { label: 'Library', href: '#' }, { label: 'Data' }]}
        />
      )

      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
      const items = screen.getAllByRole('listitem')
      const current = items[items.length - 1]
      expect(current).toHaveTextContent('Data')
      expect(current).toHaveClass('active')
      expect(current).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying ol', () => {
      const ref = React.createRef<HTMLOListElement>()
      render(<Breadcrumb ref={ref}>Test</Breadcrumb>)
      expect(ref.current).toBeInstanceOf(HTMLOListElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Data' }]} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('RTL locale', () => {
    // The item separator is a pure CSS ::before on .breadcrumb-item (chassis-css owns any
    // [dir=rtl] mirroring there) — nothing in this component's own markup or logic is
    // direction-dependent. Documents that audit finding as an executable check.
    test('renders the same way as under LTR', () => {
      render(
        <I18nProvider locale="ar-SA">
          <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Data' }]} />
        </I18nProvider>
      )
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
      const items = screen.getAllByRole('listitem')
      expect(items[items.length - 1]).toHaveTextContent('Data')
    })
  })
})
