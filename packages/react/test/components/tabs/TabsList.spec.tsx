import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Tabs, TabsList, TabsTab, TabsPanel } from '../../../src/index'

describe('TabsList', () => {
  describe('rendering', () => {
    test('renders a ul with role="tablist" and forwards aria-label', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs">
            <TabsTab id="home">Home</TabsTab>
          </TabsList>
          <TabsPanel id="home">Home content</TabsPanel>
        </Tabs>
      )
      expect(screen.getByRole('tablist', { name: 'Example tabs' })).toBeInTheDocument()
    })

    test('applies nav-tabs by default and nav-pills with variant="pills"', () => {
      const { rerender } = render(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs">
            <TabsTab id="home">Home</TabsTab>
          </TabsList>
          <TabsPanel id="home">Home content</TabsPanel>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-tabs')

      rerender(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs" variant="pills">
            <TabsTab id="home">Home</TabsTab>
          </TabsList>
          <TabsPanel id="home">Home content</TabsPanel>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-pills')
    })

    test('applies a custom className alongside the base classes', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs" className="bazinga">
            <TabsTab id="home">Home</TabsTab>
          </TabsList>
          <TabsPanel id="home">Home content</TabsPanel>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-tabs', 'bazinga')
    })

    test('wraps each tab in a presentation-only <li>', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs">
            <TabsTab id="home">Home</TabsTab>
          </TabsList>
          <TabsPanel id="home">Home content</TabsPanel>
        </Tabs>
      )
      // eslint-disable-next-line testing-library/no-node-access
      const listItem = screen.getByRole('tab', { name: 'Home' }).closest('li')
      expect(listItem).toHaveAttribute('role', 'presentation')
    })

    test('throws when rendered outside a Tabs', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      // React's dev-mode guarded-callback replay dispatches this render error as a real DOM
      // "error" event so jsdom can report it; suppress it here since the throw is expected and
      // already asserted below.
      const onWindowError = (event: ErrorEvent) => event.preventDefault()
      window.addEventListener('error', onWindowError)

      expect(() => render(<TabsList aria-label="Example tabs">{null}</TabsList>)).toThrow(
        'TabsList and TabsPanel must be rendered inside a Tabs'
      )

      window.removeEventListener('error', onWindowError)
      consoleError.mockRestore()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs">
            <TabsTab id="home">Home</TabsTab>
            <TabsTab id="profile">Profile</TabsTab>
          </TabsList>
          <TabsPanel id="home">Home content</TabsPanel>
          <TabsPanel id="profile">Profile content</TabsPanel>
        </Tabs>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
