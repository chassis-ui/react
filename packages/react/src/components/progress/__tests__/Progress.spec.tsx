import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Progress } from '../../../index'

describe('Progress', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<Progress>Test</Progress>)
      const progress = screen.getByText('Test')
      expect(progress).toHaveClass('progress')
      expect(progress.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Progress color="warning" value={50} />)
      expect(container).toMatchSnapshot()
    })

    test('applies thin and white classes with className', () => {
      render(
        <Progress className="bazinga" thin white>
          Test
        </Progress>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'progress',
        'progress-thin',
        'progress-white',
        'bazinga'
      )
    })

    test('applies the height style', () => {
      render(<Progress height={100}>Test</Progress>)
      expect(screen.getByText('Test')).toHaveStyle('height: 100px')
    })
  })

  describe('progress bar rendering', () => {
    test('renders an inner progressbar when value is set', () => {
      render(<Progress color="warning" value={50} />)
      const bar = screen.getByRole('progressbar')
      expect(bar).toHaveAttribute('aria-valuenow', '50')
      expect(bar).toHaveStyle('width: 50%')
    })

    test('renders children directly when value is 0', () => {
      render(<Progress value={0}>Fallback content</Progress>)
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      expect(screen.getByText('Fallback content')).toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Progress ref={ref}>Test</Progress>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    // A progressbar needs an accessible name — Progress doesn't supply one, so callers must
    // pass aria-label/aria-labelledby themselves. This check does that, as real usage should.
    test('has no axe violations', async () => {
      const { container } = render(
        <Progress aria-label="Upload progress" color="warning" value={50} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
