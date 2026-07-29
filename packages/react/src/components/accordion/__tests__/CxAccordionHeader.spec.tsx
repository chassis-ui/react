import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxAccordionHeader } from '../../../index'

describe('CxAccordionHeader', () => {
  describe('rendering', () => {
    test('renders a summary wrapping an accordion-title span', () => {
      // Browsers expose <summary> with an implicit button-like role; the testing-environment's
      // role computation doesn't compute that mapping, so this checks the tag directly instead
      // of going through getByRole('button').
      const { container } = render(<CxAccordionHeader>Test</CxAccordionHeader>)
      expect(container.firstChild?.nodeName).toBe('SUMMARY')
      expect(screen.getByText('Test')).toHaveClass('accordion-title')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxAccordionHeader>Test</CxAccordionHeader>)
      expect(container).toMatchSnapshot()
    })

    test('applies a custom className to the summary', () => {
      // className is applied to the <summary> itself, not the inner accordion-title span, and
      // (as above) <summary> has no queryable role here — container access is the only option.
      const { container } = render(<CxAccordionHeader className="bazinga">Test</CxAccordionHeader>)
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('bazinga')
    })

    test('is the interactive summary of its parent details element', () => {
      // Same <summary> role limitation as above, so this checks tag/nesting directly.
      render(
        <details>
          <CxAccordionHeader>Test</CxAccordionHeader>
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
      render(<CxAccordionHeader ref={ref}>Test</CxAccordionHeader>)
      expect(ref.current?.nodeName).toBe('SUMMARY')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations inside a details element', async () => {
      const { container } = render(
        <details>
          <CxAccordionHeader>Test</CxAccordionHeader>
        </details>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
