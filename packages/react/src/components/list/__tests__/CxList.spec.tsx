import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxList, CxListItem } from '../../../index'

describe('CxList', () => {
  describe('rendering', () => {
    test('renders a ul with the base class by default', () => {
      render(<CxList>Test</CxList>)
      const list = screen.getByText('Test')
      expect(list).toHaveClass('list')
      expect(list.tagName).toBe('UL')
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
      render(
        <CxList className="bazinga" component="h3" flush={true} layout="xlarge:horizontal">
          Test
        </CxList>
      )
      const list = screen.getByText('Test')
      expect(list).toHaveClass('list', 'flush', 'xlarge:horizontal', 'bazinga')
      expect(list.tagName).toBe('H3')
    })

    test('applies plain and numbered classes', () => {
      render(
        <CxList component="ol" plain={true} numbered={true}>
          Test
        </CxList>
      )
      expect(screen.getByText('Test')).toHaveClass('plain', 'numbered')
    })

    test('applies color and variant classes', () => {
      render(
        <CxList color="primary" variant="solid">
          Test
        </CxList>
      )
      expect(screen.getByText('Test')).toHaveClass('context', 'primary', 'solid')
    })

    test('forwards arbitrary HTML attributes', () => {
      render(
        <CxList id="nav-list" data-testid="my-list">
          Test
        </CxList>
      )
      const list = screen.getByText('Test')
      expect(list).toHaveAttribute('id', 'nav-list')
      expect(list).toHaveAttribute('data-testid', 'my-list')
    })
  })

  describe('data-driven items', () => {
    test('renders items from the items prop, ignoring children', () => {
      render(
        <CxList
          items={[
            { label: 'Dashboard', href: '#', active: true },
            { label: 'Profile', href: '#' },
            { label: 'Billing', href: '#', disabled: true, color: 'warning' }
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
