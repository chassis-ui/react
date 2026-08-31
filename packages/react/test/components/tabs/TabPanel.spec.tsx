import * as React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Tabs, TabList, Tab, TabPanel } from '../../../src/index'

describe('TabPanel', () => {
  describe('rendering', () => {
    test('renders its content only while its id matches the selected tab', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
            <Tab id="profile">Profile</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
          <TabPanel id="profile">Profile content</TabPanel>
        </Tabs>
      )
      expect(screen.getByText('Home content')).toBeInTheDocument()
      expect(screen.queryByText('Profile content')).not.toBeInTheDocument()
    })

    test('renders a div with the tab-pane/fade/show/active classes', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(screen.getByRole('tabpanel')).toHaveClass('tab-pane', 'fade', 'show', 'active')
    })

    test('applies a custom className alongside the base classes', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home" className="bazinga">
            Home content
          </TabPanel>
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

      expect(() => render(<TabPanel id="home">Home content</TabPanel>)).toThrow(
        'TabList and TabPanel must be rendered inside a Tabs'
      )

      window.removeEventListener('error', onWindowError)
      consoleError.mockRestore()
    })
  })

  describe('transition', () => {
    test('removes a deselected panel immediately, so only one panel is ever in flow at once', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
            <Tab id="profile">Profile</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
          <TabPanel id="profile">Profile content</TabPanel>
        </Tabs>
      )

      fireEvent.click(screen.getByRole('tab', { name: 'Profile' }))

      // No exit fade: the outgoing panel must be gone in the same tick, not lingering alongside
      // the incoming one — chassis-css's `.tab-content`/`.tab-pane` has no support for two panels
      // sharing layout, so a staggered exit would visibly shove the surrounding content around.
      expect(screen.queryByText('Home content')).not.toBeInTheDocument()
    })

    test('fades a newly selected panel in rather than popping it in at full opacity', async () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
            <Tab id="profile">Profile</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
          <TabPanel id="profile">Profile content</TabPanel>
        </Tabs>
      )

      fireEvent.click(screen.getByRole('tab', { name: 'Profile' }))

      // Starts without `show` (opacity 0, per chassis-css's `.fade:not(.show)`) so the CSS
      // transition to opacity 1 is actually visible, instead of popping in at full opacity.
      expect(screen.getByText('Profile content')).not.toHaveClass('show')
      await waitFor(() => expect(screen.getByText('Profile content')).toHaveClass('show'))
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home" ref={ref}>
            Home content
          </TabPanel>
        </Tabs>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
