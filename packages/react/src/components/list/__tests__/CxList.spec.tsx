import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxList, CxListItem } from '../../../index'

describe('CxList', () => {
  describe('rendering', () => {
    test('renders a ul with the base class by default', () => {
      const { container } = render(<CxList>Test</CxList>)
      expect(container.firstChild).toHaveClass('list')
      expect(container.firstChild?.nodeName).toBe('UL')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxList>
          <CxListItem>A</CxListItem>
          <CxListItem>B</CxListItem>
          <CxListItem>C</CxListItem>
        </CxList>
      )
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with flush and layout classes', () => {
      const { container } = render(
        <CxList className="bazinga" component="h3" flush={true} layout="xlarge:horizontal">
          Test
        </CxList>
      )
      expect(container.firstChild).toHaveClass('list', 'flush', 'xlarge:horizontal', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('H3')
    })

    test('applies plain and numbered classes', () => {
      const { container } = render(
        <CxList component="ol" plain={true} numbered={true}>
          Test
        </CxList>
      )
      expect(container.firstChild).toHaveClass('plain', 'numbered')
    })

    test('applies context and variant classes', () => {
      const { container } = render(
        <CxList context="primary" variant="solid">
          Test
        </CxList>
      )
      expect(container.firstChild).toHaveClass('context', 'primary', 'solid')
    })

    test('forwards arbitrary HTML attributes', () => {
      const { container } = render(
        <CxList id="nav-list" data-testid="my-list">
          Test
        </CxList>
      )
      expect(container.firstChild).toHaveAttribute('id', 'nav-list')
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-list')
    })
  })

  describe('data-driven items', () => {
    test('renders items from the items prop, ignoring children', () => {
      render(
        <CxList
          items={[
            { label: 'Dashboard', href: '#', active: true },
            { label: 'Profile', href: '#' },
            { label: 'Billing', href: '#', disabled: true, context: 'warning' }
          ]}
        />
      )

      const dashboard = screen.getByRole('link', { name: 'Dashboard' })
      expect(dashboard).toHaveClass('list-action')
      expect(dashboard).toHaveAttribute('aria-current', 'true')

      const billing = screen.getByRole('link', { name: 'Billing' })
      expect(billing).toHaveClass('warning')
      expect(billing).toHaveAttribute('aria-disabled', 'true')
    })

    test('matches the baseline markup snapshot for data-driven items', () => {
      const { container } = render(
        <CxList
          items={[
            { label: 'Dashboard', href: '#', active: true },
            { label: 'Profile', href: '#' }
          ]}
        />
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying ul', () => {
      const ref = React.createRef<HTMLUListElement>()
      render(<CxList ref={ref}>Test</CxList>)
      expect(ref.current).toBeInstanceOf(HTMLUListElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxList>
          <CxListItem>A</CxListItem>
          <CxListItem>B</CxListItem>
        </CxList>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
