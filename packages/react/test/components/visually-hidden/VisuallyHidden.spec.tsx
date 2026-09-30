import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Button, VisuallyHidden } from '../../../src/index'

describe('VisuallyHidden', () => {
  describe('rendering', () => {
    test('renders a span with .visually-hidden', () => {
      render(<VisuallyHidden>Opens in a new tab</VisuallyHidden>)
      const element = screen.getByText('Opens in a new tab')
      expect(element).toHaveClass('visually-hidden')
      expect(element.tagName).toBe('SPAN')
    })

    test('renders .visually-hidden-focusable, and not .visually-hidden, when focusable', () => {
      render(
        <VisuallyHidden component="a" focusable href="#content">
          Skip to main content
        </VisuallyHidden>
      )
      const link = screen.getByRole('link', { name: 'Skip to main content' })
      expect(link).toHaveClass('visually-hidden-focusable')
      expect(link).not.toHaveClass('visually-hidden')
    })

    test("adds the caller's className after its own", () => {
      render(<VisuallyHidden className="custom">Label</VisuallyHidden>)
      expect(screen.getByText('Label')).toHaveClass('visually-hidden', 'custom')
    })

    test('names the control it sits in', () => {
      render(
        <Button>
          <span aria-hidden="true">×</span>
          <VisuallyHidden>Close</VisuallyHidden>
        </Button>
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('renders its child in place under asChild', () => {
      render(
        <VisuallyHidden asChild focusable>
          <a href="#content">Skip to main content</a>
        </VisuallyHidden>
      )
      expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveClass(
        'visually-hidden-focusable'
      )
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the root element', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<VisuallyHidden ref={ref}>Label</VisuallyHidden>)
      expect(ref.current).toBe(screen.getByText('Label'))
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a skip link', async () => {
      const { container } = render(
        <>
          <VisuallyHidden component="a" focusable href="#content">
            Skip to main content
          </VisuallyHidden>
          <main id="content">Content</main>
        </>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
