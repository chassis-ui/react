import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxIcon } from '../../../index'

describe('CxIcon', () => {
  describe('rendering', () => {
    test('renders an SVG with the base class and a sprite reference by default', () => {
      const { container } = render(<CxIcon name="folder-tree" />)
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

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxIcon name="folder-tree" />)
      expect(container).toMatchSnapshot()
    })

    test('applies a custom size and sprite path', () => {
      const { container } = render(<CxIcon name="folder-tree" size={32} sprite="/icons.svg" />)
      const svg = container.firstChild as SVGSVGElement
      expect(svg).toHaveAttribute('width', '32')
      expect(svg).toHaveAttribute('height', '32')
      expect(svg.querySelector('use')).toHaveAttribute('href', '/icons.svg#folder-tree')
    })

    test('renders a title element and drops aria-hidden when a title is given', () => {
      const { container } = render(<CxIcon name="folder-tree" title="Folder tree" />)
      const svg = container.firstChild as SVGSVGElement
      expect(svg).not.toHaveAttribute('aria-hidden')
      expect(svg.querySelector('title')).toHaveTextContent('Folder tree')
    })

    test('applies the caller className alongside the base class', () => {
      const { container } = render(<CxIcon name="folder-tree" className="bazinga" />)
      expect(container.firstChild).toHaveClass('icon', 'bazinga')
    })
  })

  describe('font mode', () => {
    test('renders a span with the base and cx-{name} classes', () => {
      const { container } = render(<CxIcon name="folder-tree" font />)
      expect(container.firstChild).toHaveClass('icon', 'cx-folder-tree')
      expect(container.firstChild?.nodeName).toBe('SPAN')
      expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    })

    test('exposes an accessible name via aria-label when a title is given', () => {
      const { container } = render(<CxIcon name="folder-tree" font title="Folder tree" />)
      expect(container.firstChild).not.toHaveAttribute('aria-hidden')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Folder tree')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying svg by default', () => {
      const ref = React.createRef<SVGSVGElement>()
      render(<CxIcon name="folder-tree" ref={ref} />)
      expect(ref.current).toBeInstanceOf(SVGSVGElement)
    })

    test('forwards a ref to the underlying span in font mode', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<CxIcon name="folder-tree" font ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxIcon name="folder-tree" title="Folder tree" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
