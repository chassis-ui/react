import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxAccordion, CxAccordionItem } from '../../../index'

describe('CxAccordion', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<CxAccordion>Test</CxAccordion>)
      expect(screen.getByText('Test')).toHaveClass('accordion')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxAccordion>Test</CxAccordion>)
      expect(container).toMatchSnapshot()
    })

    test('applies flush, size and caretEnd classes with className', () => {
      render(
        <CxAccordion className="bazinga" flush size="large" caretEnd>
          Test
        </CxAccordion>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'accordion',
        'flush',
        'caret-end',
        'large',
        'bazinga'
      )
    })
  })

  describe('data-driven items', () => {
    test('renders items from the items prop, ignoring children', () => {
      render(
        <CxAccordion
          items={[
            { id: 'a', header: 'Header A', body: 'Body A', open: true },
            { id: 'b', header: 'Header B', body: 'Body B' }
          ]}
        />
      )
      expect(screen.getByText('Header A')).toBeInTheDocument()
      expect(screen.getByText('Body A')).toBeInTheDocument()
      expect(screen.getByText('Header B')).toBeInTheDocument()
      expect(screen.getByText('Body B')).toBeInTheDocument()
    })
  })

  describe('shared group name', () => {
    test('sets the shared group name for items that do not set their own', () => {
      render(
        <CxAccordion name="shared-name">
          <CxAccordionItem>Item</CxAccordionItem>
        </CxAccordion>
      )
      expect(screen.getByRole('group')).toHaveAttribute('name', 'shared-name')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxAccordion ref={ref}>Test</CxAccordion>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxAccordion
          items={[
            { id: 'a', header: 'Header A', body: 'Body A', open: true },
            { id: 'b', header: 'Header B', body: 'Body B' }
          ]}
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
