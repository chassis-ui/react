import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { TextInput, FormLabel } from '../../../src/index'

describe('FormLabel', () => {
  describe('rendering', () => {
    test('renders a label with the base class and className merged', () => {
      render(<FormLabel className="bazinga">Test</FormLabel>)
      const label = screen.getByText('Test')
      expect(label).toHaveClass('form-label', 'bazinga')
      expect(label.tagName).toBe('LABEL')
    })

    test('customClassName overrides the base and passed className entirely', () => {
      render(
        <FormLabel className="bazinga" customClassName="only-this">
          Test
        </FormLabel>
      )
      expect(screen.getByText('Test')).toHaveAttribute('class', 'only-this')
    })

    test('associates with a control via htmlFor', () => {
      render(
        <>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextInput aria-label="Email" id="email" />
        </>
      )
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying label', () => {
      const ref = React.createRef<HTMLLabelElement>()
      render(<FormLabel ref={ref}>Test</FormLabel>)
      expect(ref.current).toBeInstanceOf(HTMLLabelElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextInput aria-label="Email" id="email" />
        </>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
