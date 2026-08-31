import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Spinner } from '../../../src/index'

describe('Spinner', () => {
  describe('rendering', () => {
    test('renders a div with the border variant class and a status role by default', () => {
      render(<Spinner />)
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('spinner-border')
      expect(spinner.tagName).toBe('DIV')
    })

    test('exposes a visually-hidden loading label by default', () => {
      render(<Spinner />)
      expect(screen.getByText('Loading...')).toHaveClass('visually-hidden')
    })

    test('renders as a custom component with color, size, variant and className', () => {
      render(
        <Spinner className="bazinga" color="warning" component="span" size="small" variant="grow">
          Test
        </Spinner>
      )
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('spinner-grow', 'fg-warning', 'spinner-grow-small', 'bazinga')
      expect(spinner.tagName).toBe('SPAN')
    })

    test('accepts a custom visually hidden label', () => {
      render(<Spinner visuallyHiddenLabel="Fetching data…" />)
      expect(screen.getByText('Fetching data…')).toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Spinner ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Spinner />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
