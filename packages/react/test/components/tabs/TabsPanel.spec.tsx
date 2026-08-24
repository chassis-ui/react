import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Tabs, TabsList, TabsTab, TabsPanel } from '../../../src/index'

describe('TabsPanel', () => {
  describe('rendering', () => {
    test('renders its content only while its id matches the selected tab', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs">
            <TabsTab id="home">Home</TabsTab>
            <TabsTab id="profile">Profile</TabsTab>
          </TabsList>
          <TabsPanel id="home">Home content</TabsPanel>
          <TabsPanel id="profile">Profile content</TabsPanel>
        </Tabs>
      )
      expect(screen.getByText('Home content')).toBeInTheDocument()
      expect(screen.queryByText('Profile content')).not.toBeInTheDocument()
    })

    test('renders a div with the tab-pane/fade/show/active classes', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs">
            <TabsTab id="home">Home</TabsTab>
          </TabsList>
          <TabsPanel id="home">Home content</TabsPanel>
        </Tabs>
      )
      expect(screen.getByRole('tabpanel')).toHaveClass('tab-pane', 'fade', 'show', 'active')
    })

    test('applies a custom className alongside the base classes', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs">
            <TabsTab id="home">Home</TabsTab>
          </TabsList>
          <TabsPanel id="home" className="bazinga">
            Home content
          </TabsPanel>
        </Tabs>
      )
      expect(screen.getByRole('tabpanel')).toHaveClass('bazinga')
    })

    test('throws when rendered outside a Tabs', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      // React's dev-mode guarded-callback replay dispatches this render error as a real DOM
      // "error" event so jsdom can report it; suppress it here since the throw is expected and
      // already asserted below.
      const onWindowError = (event: ErrorEvent) => event.preventDefault()
      window.addEventListener('error', onWindowError)

      expect(() => render(<TabsPanel id="home">Home content</TabsPanel>)).toThrow(
        'TabsList and TabsPanel must be rendered inside a Tabs'
      )

      window.removeEventListener('error', onWindowError)
      consoleError.mockRestore()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs">
            <TabsTab id="home">Home</TabsTab>
          </TabsList>
          <TabsPanel id="home" ref={ref}>
            Home content
          </TabsPanel>
        </Tabs>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Tabs defaultSelectedKey="home">
          <TabsList aria-label="Example tabs">
            <TabsTab id="home">Home</TabsTab>
          </TabsList>
          <TabsPanel id="home">Home content</TabsPanel>
        </Tabs>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
