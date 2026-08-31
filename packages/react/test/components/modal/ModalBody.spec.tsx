import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ModalBody } from '../../../src/index'

describe('ModalBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<ModalBody className="bazinga">Test</ModalBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('modal-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ModalBody ref={ref}>Test</ModalBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<ModalBody>Test</ModalBody>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
