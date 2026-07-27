import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxProgress } from '../../../index'

describe('CxProgress', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      const { container } = render(<CxProgress>Test</CxProgress>)
      expect(container.firstChild).toHaveClass('progress')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxProgress context="warning" value={50} />)
      expect(container).toMatchSnapshot()
    })

    test('applies thin and white classes with className', () => {
      const { container } = render(
        <CxProgress className="bazinga" thin white>
          Test
        </CxProgress>
      )
      expect(container.firstChild).toHaveClass(
        'progress',
        'progress-thin',
        'progress-white',
        'bazinga'
      )
    })

    test('applies the height style', () => {
      const { container } = render(<CxProgress height={100}>Test</CxProgress>)
      expect(container.firstChild).toHaveStyle('height: 100px')
    })
  })

  describe('progress bar rendering', () => {
    test('renders an inner progressbar when value is set', () => {
      render(<CxProgress context="warning" value={50} />)
      const bar = screen.getByRole('progressbar')
      expect(bar).toHaveAttribute('aria-valuenow', '50')
      expect(bar).toHaveStyle('width: 50%')
    })

    test('renders children directly when value is 0', () => {
      render(<CxProgress value={0}>Fallback content</CxProgress>)
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      expect(screen.getByText('Fallback content')).toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxProgress ref={ref}>Test</CxProgress>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    // A progressbar needs an accessible name — CxProgress doesn't supply one, so callers must
    // pass aria-label/aria-labelledby themselves. This check does that, as real usage should.
    test('has no axe violations', async () => {
      const { container } = render(
        <CxProgress aria-label="Upload progress" context="warning" value={50} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
