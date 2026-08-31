import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CardBody } from '../../../src/index'

describe('CardBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CardBody className="bazinga">Test</CardBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('card-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })
  })

  describe('layout props', () => {
    test('applies direction, responsive and gap as classes', () => {
      render(
        <CardBody direction="row" responsive={{ large: 'column' }} gap="medium">
          Test
        </CardBody>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'card-body',
        'flex-row',
        'large:flex-column',
        'gap-medium'
      )
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardBody ref={ref}>Test</CardBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardBody>Test</CardBody>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
