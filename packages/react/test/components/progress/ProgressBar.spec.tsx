import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ProgressBar } from '../../../src/index'

describe('ProgressBar', () => {
  describe('rendering', () => {
    test('renders a progressbar with value-derived aria attributes', () => {
      render(<ProgressBar color="warning" value={50} />)
      const bar = screen.getByRole('progressbar')
      expect(bar).toHaveClass('progress-bar', 'warning')
      expect(bar).toHaveAttribute('aria-valuenow', '50')
      expect(bar).toHaveAttribute('aria-valuemin', '0')
      expect(bar).toHaveAttribute('aria-valuemax', '100')
      expect(bar).toHaveStyle('width: 50%')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<ProgressBar color="warning" value={50} />)
      expect(container).toMatchSnapshot()
    })

    test('applies animated and striped variant classes with className', () => {
      render(
        <ProgressBar color="warning" className="bazinga" animated value={50} variant="striped">
          Test
        </ProgressBar>
      )
      expect(screen.getByRole('progressbar')).toHaveClass(
        'progress-bar-striped',
        'progress-bar-animated',
        'bazinga'
      )
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ProgressBar ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    // A progressbar needs an accessible name — ProgressBar doesn't supply one, so callers
    // must pass aria-label/aria-labelledby themselves. This check does that, as real usage should.
    test('has no axe violations', async () => {
      const { container } = render(
        <ProgressBar aria-label="Upload progress" color="warning" value={50} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
