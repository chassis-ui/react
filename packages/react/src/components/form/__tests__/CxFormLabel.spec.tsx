import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxTextInput, CxFormLabel } from '../../../index'

describe('CxFormLabel', () => {
  describe('rendering', () => {
    test('renders a label with the base class and className merged', () => {
      render(<CxFormLabel className="bazinga">Test</CxFormLabel>)
      const label = screen.getByText('Test')
      expect(label).toHaveClass('form-label', 'bazinga')
      expect(label.tagName).toBe('LABEL')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFormLabel>Test</CxFormLabel>)
      expect(container).toMatchSnapshot()
    })

    test('customClassName overrides the base and passed className entirely', () => {
      render(
        <CxFormLabel className="bazinga" customClassName="only-this">
          Test
        </CxFormLabel>
      )
      expect(screen.getByText('Test')).toHaveAttribute('class', 'only-this')
    })

    test('associates with a control via htmlFor', () => {
      render(
        <>
          <CxFormLabel htmlFor="email">Email</CxFormLabel>
          <CxTextInput aria-label="Email" id="email" />
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
          <CxTextInput aria-label="Email" id="email" />
        </>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
