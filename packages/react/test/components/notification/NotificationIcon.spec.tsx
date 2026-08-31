import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NotificationIcon } from '../../../src/index'

describe('NotificationIcon', () => {
  // Decorative by default (aria-hidden), so there's no accessible query — needs raw node access.
  /* eslint-disable testing-library/no-node-access */
  describe('rendering', () => {
    test('renders an SVG with the notification-icon class and is hidden from assistive tech by default', () => {
      const { container } = render(<NotificationIcon name="info-circle-solid" />)
      const svg = container.firstChild as SVGSVGElement
      expect(svg).toHaveClass('icon', 'notification-icon')
      expect(svg.nodeName).toBe('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('height', '24')
      expect(svg).toHaveAttribute('width', '24')
      expect(svg.querySelector('use')).toHaveAttribute(
        'href',
        '/static/icons/chassis-icons.svg#info-circle-solid'
      )
    })

    test('applies the caller className alongside the base classes', () => {
      const { container } = render(
        <NotificationIcon name="info-circle-solid" className="bazinga" />
      )
      expect(container.firstChild).toHaveClass('icon', 'notification-icon', 'bazinga')
    })
  })
  /* eslint-enable testing-library/no-node-access */

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying svg', () => {
      const ref = React.createRef<SVGSVGElement>()
      render(<NotificationIcon name="info-circle-solid" ref={ref} />)
      expect(ref.current).toBeInstanceOf(SVGSVGElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<NotificationIcon name="info-circle-solid" title="Info" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
