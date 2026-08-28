import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Icon } from '../../../src/index'

describe('Icon', () => {
  // The icon is decorative by default (aria-hidden), and even with a title set, jsdom's
  // accessibility tree (unlike a real browser's) doesn't map a bare `<svg>` with a `<title>` to
  // role="img" - verified directly, and a jsdom/dom-testing-library limitation, not a real bug
  // (see the `font mode` block below, whose `role="img"` span *does* resolve there since that
  // mapping doesn't depend on SVG-AAM). So the SVG-mode assertions below need raw node access.
  /* eslint-disable testing-library/no-node-access */
  describe('rendering', () => {
    test('renders an SVG with the base class and a sprite reference by default', () => {
      const { container } = render(<Icon name="folder-tree" />)
      const svg = container.firstChild as SVGSVGElement
      expect(svg).toHaveClass('icon')
      expect(svg.nodeName).toBe('svg')
      expect(svg).toHaveAttribute('width', '24')
      expect(svg).toHaveAttribute('height', '24')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg.querySelector('use')).toHaveAttribute(
        'href',
        '/static/icons/chassis-icons.svg#folder-tree'
      )
    })

    test('applies a custom size and sprite path', () => {
      const { container } = render(<Icon name="folder-tree" size={32} sprite="/icons.svg" />)
      const svg = container.firstChild as SVGSVGElement
      expect(svg).toHaveAttribute('width', '32')
      expect(svg).toHaveAttribute('height', '32')
      expect(svg.querySelector('use')).toHaveAttribute('href', '/icons.svg#folder-tree')
    })

    test('renders a title element and drops aria-hidden when a title is given', () => {
      const { container } = render(<Icon name="folder-tree" title="Folder tree" />)
      const svg = container.firstChild as SVGSVGElement
      expect(svg).not.toHaveAttribute('aria-hidden')
      expect(svg.querySelector('title')).toHaveTextContent('Folder tree')
    })

    test('sets role="img" so a title actually sticks as the accessible name', () => {
      const { container } = render(<Icon name="folder-tree" title="Folder tree" />)
      const svg = container.firstChild as SVGSVGElement
      expect(svg).toHaveAttribute('role', 'img')
    })

    test('has no role when there is no title', () => {
      const { container } = render(<Icon name="folder-tree" />)
      expect(container.firstChild).not.toHaveAttribute('role')
    })

    test('applies the caller className alongside the base class', () => {
      const { container } = render(<Icon name="folder-tree" className="bazinga" />)
      expect(container.firstChild).toHaveClass('icon', 'bazinga')
    })

    test('forwards an SVG-only attribute in the default (svg) mode', () => {
      const { container } = render(<Icon name="folder-tree" viewBox="0 0 1 1" />)
      expect(container.firstChild).toHaveAttribute('viewBox', '0 0 1 1')
    })
  })
  /* eslint-enable testing-library/no-node-access */

  describe('font mode', () => {
    test('renders a span with the base and cx-{name} classes', () => {
      const { container } = render(<Icon name="folder-tree" font />)
      // Decorative (aria-hidden, no role) - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      const span = container.firstChild
      expect(span).toHaveClass('icon', 'cx-folder-tree')
      expect(span?.nodeName).toBe('SPAN')
      expect(span).toHaveAttribute('aria-hidden', 'true')
    })

    test('exposes an accessible name via role="img" and aria-label when a title is given', () => {
      render(<Icon name="folder-tree" font title="Folder tree" />)
      const icon = screen.getByRole('img', { name: 'Folder tree' })
      expect(icon).not.toHaveAttribute('aria-hidden')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying svg by default', () => {
      const ref = React.createRef<SVGSVGElement>()
      render(<Icon name="folder-tree" ref={ref} />)
      expect(ref.current).toBeInstanceOf(SVGSVGElement)
    })

    test('forwards a ref to the underlying span in font mode', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Icon name="folder-tree" font ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Icon name="folder-tree" title="Folder tree" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations in font mode with a title', async () => {
      const { container } = render(<Icon name="folder-tree" font title="Folder tree" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
