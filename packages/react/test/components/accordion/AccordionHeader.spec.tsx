import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { AccordionHeader } from '../../../src/index'

describe('AccordionHeader', () => {
  describe('rendering', () => {
    test('renders a summary wrapping an accordion-title span', () => {
      // Browsers expose <summary> with an implicit button-like role; the testing-environment's
      // role computation doesn't compute that mapping, so this checks the tag directly instead
      // of going through getByRole('button').
      const { container } = render(<AccordionHeader>Test</AccordionHeader>)
      expect(container.firstChild?.nodeName).toBe('SUMMARY')
      expect(screen.getByText('Test')).toHaveClass('accordion-title')
      expect(screen.getByText('Test').tagName).toBe('SPAN')
    })

    test('applies a custom className to the summary', () => {
      // className is applied to the <summary> itself, not the inner accordion-title span, and
      // (as above) <summary> has no queryable role here — container access is the only option.
      const { container } = render(<AccordionHeader className="bazinga">Test</AccordionHeader>)
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('bazinga')
    })

    test('is the interactive summary of its parent details element', () => {
      // Same <summary> role limitation as above, so this checks tag/nesting directly.
      render(
        <details>
          <AccordionHeader>Test</AccordionHeader>
        </details>
      )
      const details = screen.getByRole('group')
      // eslint-disable-next-line testing-library/no-node-access
      const summary = screen.getByText('Test').closest('summary')
      // eslint-disable-next-line testing-library/no-node-access
      expect(summary?.parentElement).toBe(details)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying summary', () => {
      const ref = React.createRef<HTMLElement>()
      render(<AccordionHeader ref={ref}>Test</AccordionHeader>)
      expect(ref.current?.nodeName).toBe('SUMMARY')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations inside a details element', async () => {
      const { container } = render(
        <details>
          <AccordionHeader>Test</AccordionHeader>
        </details>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
