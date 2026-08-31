import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Navbar } from '../../../src/index'

describe('Navbar', () => {
  describe('rendering', () => {
    test('renders a nav with the base class by default', () => {
      render(<Navbar>Test</Navbar>)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navbar')
      expect(nav.tagName).toBe('NAV')
    })

    test('renders as a custom component with color, variant, container and placement', () => {
      render(
        <Navbar
          className="bazinga"
          color="primary"
          variant="solid"
          component="h3"
          container="xlarge"
          expand="large"
          placement="sticky-bottom"
        >
          Test
        </Navbar>
      )
      const navbar = screen.getByRole('heading', { name: 'Test' })
      expect(navbar).toHaveClass(
        'bazinga',
        'navbar',
        'primary',
        'context',
        'solid',
        'large:navbar-expand',
        'sticky-bottom'
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

    test('applies translucent and data-cx-theme', () => {
      render(
        <Navbar translucent data-cx-theme="dark">
          Test
        </Navbar>
      )
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('translucent')
      expect(nav).toHaveAttribute('data-cx-theme', 'dark')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying nav', () => {
      const ref = React.createRef<HTMLElement>()
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
