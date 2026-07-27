import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxSpinner } from '../../../index'

describe('CxSpinner', () => {
  describe('rendering', () => {
    test('renders a div with the border variant class and a status role by default', () => {
      render(<CxSpinner />)
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('spinner-border')
      expect(spinner.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxSpinner />)
      expect(container).toMatchSnapshot()
    })

    test('exposes a visually-hidden loading label by default', () => {
      render(<CxSpinner />)
      expect(screen.getByText('Loading...')).toHaveClass('visually-hidden')
    })

    test('renders as a custom component with context, size, variant and className', () => {
      render(
        <CxSpinner
          className="bazinga"
          context="warning"
          component="span"
          size="small"
          variant="grow"
        >
          Test
        </CxSpinner>
      )
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('spinner-grow', 'fg-warning', 'spinner-grow-small', 'bazinga')
      expect(spinner.tagName).toBe('SPAN')
    })

    test('accepts a custom visually hidden label', () => {
      render(<CxSpinner visuallyHiddenLabel="Fetching data…" />)
      expect(screen.getByText('Fetching data…')).toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxSpinner ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxSpinner />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
