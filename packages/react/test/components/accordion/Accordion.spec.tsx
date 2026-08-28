import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Accordion, AccordionItem, I18nProvider } from '../../../src/index'

describe('Accordion', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<Accordion>Test</Accordion>)
      expect(screen.getByText('Test')).toHaveClass('accordion')
    })

    test('applies flush, size and caretEnd classes with className', () => {
      render(
        <Accordion className="bazinga" flush size="large" caretEnd>
          Test
        </Accordion>
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
        <Accordion
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

  describe('controlled expansion', () => {
    const items = [
      { id: 'a', header: 'Header A', body: 'Body A' },
      { id: 'b', header: 'Header B', body: 'Body B' }
    ]

    test('defaultExpandedKeys sets the initial open items', () => {
      render(<Accordion items={items} defaultExpandedKeys={['a']} />)
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByText('Header A').closest('details')).toHaveAttribute('open')
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByText('Header B').closest('details')).not.toHaveAttribute('open')
    })

    test('onExpandedChange fires with the updated keys on click, uncontrolled', async () => {
      const user = userEvent.setup()
      const onExpandedChange = vi.fn()
      render(<Accordion items={items} onExpandedChange={onExpandedChange} />)

      await user.click(screen.getByText('Header A'))
      expect(onExpandedChange).toHaveBeenCalledWith(['a'])
    })

    // Exclusive open-state groups (`AccordionItem`'s shared `name`) are enforced by the browser
    // itself, closing siblings natively — jsdom doesn't implement that spec behavior (it fires
    // `toggle` on same-named siblings without actually closing them), so it can't be asserted
    // here; Playwright visual regression (accordion-collapse.visual.spec.ts) covers the real
    // rendered behavior instead. `alwaysOpen` items below are independent (no shared `name`), so
    // their toggling is deterministic under jsdom too.
    const independentItems = [
      { id: 'a', header: 'Header A', body: 'Body A', alwaysOpen: true },
      { id: 'b', header: 'Header B', body: 'Body B', alwaysOpen: true }
    ]

    test('supports controlled expandedKeys - selection does not change until the prop updates', async () => {
      const user = userEvent.setup()
      const onExpandedChange = vi.fn()
      const { rerender } = render(
        <Accordion
          items={independentItems}
          expandedKeys={['a']}
          onExpandedChange={onExpandedChange}
        />
      )

      await user.click(screen.getByText('Header B'))
      expect(onExpandedChange).toHaveBeenCalledWith(['a', 'b'])
      // Controlled: nothing should change until the consumer updates expandedKeys.
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByText('Header B').closest('details')).not.toHaveAttribute('open')

      rerender(
        <Accordion
          items={independentItems}
          expandedKeys={['a', 'b']}
          onExpandedChange={onExpandedChange}
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByText('Header B').closest('details')).toHaveAttribute('open')
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByText('Header A').closest('details')).toHaveAttribute('open')
    })

    test("an item's own onToggle still fires alongside onExpandedChange", async () => {
      const user = userEvent.setup()
      const itemOnToggle = vi.fn()
      render(
        <Accordion
          items={[{ id: 'a', header: 'Header A', body: 'Body A', onToggle: itemOnToggle }]}
        />
      )

      await user.click(screen.getByText('Header A'))
      expect(itemOnToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('shared group name', () => {
    test('sets the shared group name for items that do not set their own', () => {
      render(
        <Accordion name="shared-name">
          <AccordionItem>Item</AccordionItem>
        </Accordion>
      )
      expect(screen.getByRole('group')).toHaveAttribute('name', 'shared-name')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Accordion ref={ref}>Test</Accordion>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Accordion
          items={[
            { id: 'a', header: 'Header A', body: 'Body A', open: true },
            { id: 'b', header: 'Header B', body: 'Body B' }
          ]}
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('RTL locale', () => {
    // Built on native <details>/<summary> with no left/right-directional JS of its own — the
    // expand/collapse caret is a pure CSS marker, not something this component computes. Documents
    // that audit finding as an executable check rather than only a plan note.
    test('renders and expands the same way as under LTR', () => {
      render(
        <I18nProvider locale="ar-SA">
          <Accordion items={[{ id: 'a', header: 'Header A', body: 'Body A', open: true }]} />
        </I18nProvider>
      )
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByText('Header A').closest('details')).toHaveAttribute('open')
      expect(screen.getByText('Body A')).toBeInTheDocument()
    })
  })
})
