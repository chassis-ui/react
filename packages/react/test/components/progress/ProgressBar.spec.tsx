import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { ProgressBar } from '../../../src/index'

describe('ProgressBar', () => {
  describe('rendering', () => {
    test('renders a div with the base class and width derived from value', () => {
      render(<ProgressBar value={50} data-testid="bar" />)
      const bar = screen.getByTestId('bar')
      expect(bar).toHaveClass('progress-bar')
      expect(bar).toHaveStyle('width: 50%')
    })

    test('applies the bg-{color} class', () => {
      render(<ProgressBar color="warning" value={50} data-testid="bar" />)
      const bar = screen.getByTestId('bar')
      expect(bar).toHaveClass('bg-warning', 'fg-contrast')
      // eslint-disable-next-line testing-library/no-node-access
      expect(bar.querySelector('.mx-2xsmall')).toBeInTheDocument()
    })

    test('applies striped and animated classes with className', () => {
      render(
        <ProgressBar
          color="warning"
          className="bazinga"
          animated
          value={50}
          striped
          data-testid="bar"
        >
          Test
        </ProgressBar>
      )
      expect(screen.getByTestId('bar')).toHaveClass('striped', 'animated', 'bazinga')
    })

    test('merges a custom style with the computed width instead of replacing it', () => {
      render(<ProgressBar value={50} style={{ transition: 'width 0.3s' }} data-testid="bar" />)
      const bar = screen.getByTestId('bar')
      expect(bar).toHaveStyle('width: 50%')
      expect(bar).toHaveStyle('transition: width 0.3s')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ProgressBar ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })
})
