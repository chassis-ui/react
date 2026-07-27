import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxFormInput, CxFormLabel } from '../../../index'

describe('CxFormLabel', () => {
  describe('rendering', () => {
    test('renders a label with the base class and className merged', () => {
      const { container } = render(<CxFormLabel className="bazinga">Test</CxFormLabel>)
      expect(container.firstChild).toHaveClass('form-label', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('LABEL')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFormLabel>Test</CxFormLabel>)
      expect(container).toMatchSnapshot()
    })

    test('customClassName overrides the base and passed className entirely', () => {
      const { container } = render(
        <CxFormLabel className="bazinga" customClassName="only-this">
          Test
        </CxFormLabel>
      )
      expect(container.firstChild).toHaveAttribute('class', 'only-this')
    })

    test('associates with a control via htmlFor', () => {
      render(
        <>
          <CxFormLabel htmlFor="email">Email</CxFormLabel>
          <CxFormInput id="email" />
        </>
      )
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying label', () => {
      const ref = React.createRef<HTMLLabelElement>()
      render(<CxFormLabel ref={ref}>Test</CxFormLabel>)
      expect(ref.current).toBeInstanceOf(HTMLLabelElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <>
          <CxFormLabel htmlFor="email">Email</CxFormLabel>
          <CxFormInput id="email" />
        </>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
