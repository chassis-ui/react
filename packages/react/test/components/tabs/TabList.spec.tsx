import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Tabs, TabList, Tab, TabPanel } from '../../../src/index'

describe('TabList', () => {
  describe('rendering', () => {
    test('renders a ul with role="tablist" and forwards aria-label', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(screen.getByRole('tablist', { name: 'Example tabs' })).toBeInTheDocument()
    })

    test('applies nav-tabs by default and nav-pills with variant="pills"', () => {
      const { rerender } = render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-tabs')

      rerender(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs" variant="pills">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-pills')
    })

    test('applies a custom className alongside the base classes', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs" className="bazinga">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-tabs', 'bazinga')
    })

    test('wraps each tab in a presentation-only <li>', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
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

      expect(() => render(<TabList aria-label="Example tabs">{null}</TabList>)).toThrow(
        'TabList and TabPanel must be rendered inside a Tabs'
      )

      window.removeEventListener('error', onWindowError)
      consoleError.mockRestore()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
            <Tab id="profile">Profile</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
          <TabPanel id="profile">Profile content</TabPanel>
        </Tabs>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying ul', () => {
      const ref = React.createRef<HTMLUListElement>()
      render(
        <Tabs defaultSelectedKey="home">
          <TabList ref={ref} aria-label="Example tabs">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(ref.current).toBeInstanceOf(HTMLUListElement)
    })
  })
})
