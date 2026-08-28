import * as React from 'react'
import { render, screen, within } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Progress } from '../../../src/index'

describe('Progress', () => {
  describe('rendering', () => {
    test('renders the wrapper div with the base class and an inner progressbar automatically', () => {
      render(<Progress aria-label="Test" value={50} />)
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveClass('progress')
      expect(progress.tagName).toBe('DIV')
      expect(progress).toHaveAttribute('aria-valuemin', '0')
      expect(progress).toHaveAttribute('aria-valuemax', '100')
      const bar = within(progress).getByText('', { selector: '.progress-bar' })
      expect(bar).toHaveStyle('width: 50%')
      // eslint-disable-next-line testing-library/no-node-access
      expect(bar.querySelector('.mx-2xsmall')).toBeInTheDocument()
    })

    test('applies the height as the --cx-height custom property', () => {
      render(<Progress aria-label="Test" height={100} value={50} />)
      expect(screen.getByRole('progressbar')).toHaveStyle('--cx-height: 100px')
    })

    test('merges a custom style with the computed height instead of replacing it', () => {
      render(<Progress aria-label="Test" height={100} style={{ marginTop: 8 }} value={50} />)
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveStyle('--cx-height: 100px')
      expect(progress).toHaveStyle('margin-top: 8px')
    })

    test('forwards color, striped and animated to the inner bar', () => {
      render(<Progress aria-label="Test" color="success" striped animated value={50} />)
      const bar = within(screen.getByRole('progressbar')).getByText('', {
        selector: '.progress-bar'
      })
      expect(bar).toHaveClass('bg-success', 'fg-contrast', 'striped', 'animated')
    })

    test('forwards custom HTML attributes to the wrapper element that ref points to', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Progress aria-label="Test" id="upload-progress" ref={ref} value={50} />)
      expect(ref.current).toHaveAttribute('id', 'upload-progress')
    })
  })

  describe('value and children', () => {
    test('always renders the progressbar role, even at 0%', () => {
      render(<Progress aria-label="Test" value={0} />)
      const bar = within(screen.getByRole('progressbar')).getByText('', {
        selector: '.progress-bar'
      })
      expect(bar).toHaveStyle('width: 0%')
    })

    test('renders custom children inside the bar', () => {
      render(
        <Progress aria-label="Test" value={25}>
          Custom content
        </Progress>
      )
      expect(screen.getByText('Custom content')).toBeInTheDocument()
    })

    test('clamps an out-of-range value so aria attributes and the bar width stay within bounds', () => {
      render(<Progress aria-label="Test" value={150} />)
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveAttribute('aria-valuenow', '100')
      expect(within(progress).getByText('', { selector: '.progress-bar' })).toHaveStyle(
        'width: 100%'
      )
    })

    test('clamps a negative value to 0', () => {
      render(<Progress aria-label="Test" value={-10} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    })
  })

  describe('label, showValue and inlineValue', () => {
    test('shows the value in the caption (not inside the bar) when only showValue is set', () => {
      render(<Progress aria-label="Test" showValue value={40} />)
      expect(screen.getByText('40%')).toBeInTheDocument()
      expect(
        within(screen.getByRole('progressbar')).getByText('', { selector: '.progress-bar' })
      ).toHaveTextContent('')
    })

    test('shows the value inside the bar when inlineValue is set', () => {
      render(<Progress aria-label="Test" inlineValue value={40} />)
      expect(within(screen.getByRole('progressbar')).getByText('40%')).toBeInTheDocument()
    })

    test('combines a label + showValue caption with an inlineValue reading inside the bar', () => {
      render(<Progress inlineValue label="Uploading" showValue value={40} />)
      expect(screen.getByText('Uploading')).toBeInTheDocument()
      expect(screen.getAllByText('40%')).toHaveLength(2)
      expect(within(screen.getByRole('progressbar')).getByText('40%')).toBeInTheDocument()
    })

    test('shows the label above the bar, without a value, when only label is set', () => {
      render(<Progress label="Uploading" value={40} />)
      expect(screen.getByText('Uploading')).toBeInTheDocument()
      expect(
        within(screen.getByRole('progressbar')).getByText('', { selector: '.progress-bar' })
      ).toHaveTextContent('')
    })

    test('shows the label and value together above the bar when both are set', () => {
      render(<Progress label="Uploading" showValue value={40} />)
      expect(screen.getByText('Uploading')).toBeInTheDocument()
      expect(screen.getByText('40%')).toBeInTheDocument()
      expect(
        within(screen.getByRole('progressbar')).getByText('', { selector: '.progress-bar' })
      ).toHaveTextContent('')
    })

    test('uses a string label as the default accessible name', () => {
      render(<Progress label="Uploading" value={40} />)
      expect(screen.getByRole('progressbar')).toHaveAccessibleName('Uploading')
    })

    test('an explicit aria-label takes precedence over label', () => {
      render(<Progress aria-label="Explicit label" label="Uploading" value={40} />)
      expect(screen.getByRole('progressbar')).toHaveAccessibleName('Explicit label')
    })

    test('a ReactNode label still resolves to an accessible name via aria-labelledby', () => {
      render(
        <Progress
          label={
            <span>
              Uploading <strong>file.zip</strong>
            </span>
          }
          value={40}
        />
      )
      expect(screen.getByRole('progressbar')).toHaveAccessibleName('Uploading file.zip')
    })
  })

  describe('caption wrapper', () => {
    // Whether an extra wrapper div sits above `.progress` has no accessible role of its own
    // to query by - direct node access is the only way to check for it.
    test('renders the progressbar as the root element when there is no caption', () => {
      const { container } = render(<Progress aria-label="Test" value={40} />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector(':scope > .progress')).toBe(screen.getByRole('progressbar'))
    })

    test('renders the progressbar as the root element when inlineValue is set alone', () => {
      const { container } = render(<Progress aria-label="Test" inlineValue value={40} />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector(':scope > .progress')).toBe(screen.getByRole('progressbar'))
    })

    test('wraps the caption and the bar in a div when label is set', () => {
      const { container } = render(<Progress label="Uploading" value={40} />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector(':scope > .progress')).toBeNull()
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector(':scope > div > .progress')).toBe(
        screen.getByRole('progressbar')
      )
    })

    test('wraps the caption and the bar in a div when showValue is set, even without a label', () => {
      const { container } = render(<Progress aria-label="Test" showValue value={40} />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector(':scope > .progress')).toBeNull()
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector(':scope > div > .progress')).toBe(
        screen.getByRole('progressbar')
      )
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying progressbar div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Progress aria-label="Test" ref={ref} value={50} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveClass('progress')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Progress aria-label="Upload progress" color="warning" value={50} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations with a label and showValue', async () => {
      const { container } = render(<Progress label="Upload progress" showValue value={50} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
