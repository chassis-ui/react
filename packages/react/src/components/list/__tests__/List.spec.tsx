import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { List, ListItem } from '../../../index'

describe('List', () => {
  describe('rendering', () => {
    test('renders a ul with the base class by default', () => {
      render(<List>Test</List>)
      const list = screen.getByText('Test')
      expect(list).toHaveClass('list')
      expect(list.tagName).toBe('UL')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <List>
          <ListItem>A</ListItem>
          <ListItem>B</ListItem>
          <ListItem>C</ListItem>
        </List>
      )
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with flush and layout classes', () => {
      render(
        <List className="bazinga" component="h3" flush={true} layout="xlarge:horizontal">
          Test
        </List>
      )
      const list = screen.getByText('Test')
      expect(list).toHaveClass('list', 'flush', 'xlarge:horizontal', 'bazinga')
      expect(list.tagName).toBe('H3')
    })

    test('applies plain and numbered classes', () => {
      render(
        <List component="ol" plain={true} numbered={true}>
          Test
        </List>
      )
      expect(screen.getByText('Test')).toHaveClass('plain', 'numbered')
    })

    test('applies color and variant classes', () => {
      render(
        <List color="primary" variant="solid">
          Test
        </List>
      )
      expect(screen.getByText('Test')).toHaveClass('context', 'primary', 'solid')
    })

    test('forwards arbitrary HTML attributes', () => {
      render(
        <List id="nav-list" data-testid="my-list">
          Test
        </List>
      )
      const list = screen.getByText('Test')
      expect(list).toHaveAttribute('id', 'nav-list')
      expect(list).toHaveAttribute('data-testid', 'my-list')
    })
  })

  describe('data-driven items', () => {
    test('renders items from the items prop, ignoring children', () => {
      render(
        <List
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
        <List
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
      render(<List ref={ref}>Test</List>)
      expect(ref.current).toBeInstanceOf(HTMLUListElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <List>
          <ListItem>A</ListItem>
          <ListItem>B</ListItem>
        </List>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
