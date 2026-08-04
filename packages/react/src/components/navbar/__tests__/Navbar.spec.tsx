import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Navbar } from '../../../index'

describe('Navbar', () => {
  describe('rendering', () => {
    test('renders a nav with the base class by default', () => {
      render(<Navbar>Test</Navbar>)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navbar')
      expect(nav.tagName).toBe('NAV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Navbar>Test</Navbar>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with color, colorScheme, container and placement', () => {
      render(
        <Navbar
          className="bazinga"
          color="warning"
          colorScheme="dark"
          component="h3"
          container="xlarge"
          expand="large"
          placement="fixed-bottom"
        >
          Test
        </Navbar>
      )
      const navbar = screen.getByRole('heading', { name: 'Test' })
      expect(navbar).toHaveClass(
        'bazinga',
        'navbar',
        'bg-warning',
        'navbar-dark',
        'navbar-expand-large',
        'fixed-bottom'
      )
      expect(screen.getByText('Test')).toHaveClass('container-xlarge')
    })

    test('applies boolean container and expand classes', () => {
      render(
        <Navbar container={true} expand={true}>
          Test
        </Navbar>
      )
      expect(screen.getByRole('navigation')).toHaveClass('navbar-expand')
      expect(screen.getByText('Test')).toHaveClass('container')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying nav', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Navbar ref={ref}>Test</Navbar>)
      expect(ref.current).toBeInstanceOf(HTMLElement)
      expect(ref.current?.tagName).toBe('NAV')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Navbar>Test</Navbar>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
