import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxModalBody } from '../../../index'

describe('CxModalBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CxModalBody className="bazinga">Test</CxModalBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('modal-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxModalBody>Test</CxModalBody>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxModalBody ref={ref}>Test</CxModalBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxModalBody>Test</CxModalBody>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
