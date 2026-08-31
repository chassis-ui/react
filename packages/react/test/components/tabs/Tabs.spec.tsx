import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Tabs, TabList, Tab, TabPanel } from '../../../src/index'

const BasicTabs = (props: Partial<React.ComponentProps<typeof Tabs>> = {}) => (
  <Tabs defaultSelectedKey="home" {...props}>
    <TabList aria-label="Example tabs">
      <Tab id="home">Home</Tab>
      <Tab id="profile">Profile</Tab>
      <Tab id="contact" disabled>
        Contact
      </Tab>
    </TabList>
    <TabPanel id="home">Home content</TabPanel>
    <TabPanel id="profile">Profile content</TabPanel>
    <TabPanel id="contact">Contact content</TabPanel>
  </Tabs>
)

describe('Tabs', () => {
  describe('rendering', () => {
    test('renders tabs with correct ARIA roles', async () => {
      render(<BasicTabs />)
      expect(screen.getByRole('tablist', { name: 'Example tabs' })).toBeInTheDocument()
      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(3)
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Home content')

      // The `<li>` wrapper around each tab must opt out of the tablist's accessibility tree
      // (only `tab`-role children are ARIA-allowed under `role="tablist"`).
      // eslint-disable-next-line testing-library/no-node-access
      const listItem = tabs[0]!.closest('li')
      expect(listItem).toHaveAttribute('role', 'presentation')
    })

    test('only renders the panel for the selected tab', async () => {
      render(<BasicTabs />)
      expect(screen.getByText('Home content')).toBeInTheDocument()
      expect(screen.queryByText('Profile content')).not.toBeInTheDocument()
      expect(screen.queryByText('Contact content')).not.toBeInTheDocument()
    })
  })

  describe('tab selection', () => {
    test('clicking a tab selects it and shows its panel', async () => {
      render(<BasicTabs />)
      fireEvent.click(screen.getByRole('tab', { name: 'Profile' }))
      expect(screen.getByText('Profile content')).toBeInTheDocument()
      expect(screen.queryByText('Home content')).not.toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveClass('active')
    })

    test('arrow keys navigate between tabs', async () => {
      render(<BasicTabs />)
      const home = screen.getByRole('tab', { name: 'Home' })
      act(() => home.focus())
      fireEvent.keyDown(home, { key: 'ArrowRight' })
      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus()
      expect(screen.getByText('Profile content')).toBeInTheDocument()
    })

    test('disabled tabs are skipped and not selectable', async () => {
      render(<BasicTabs />)
      const contact = screen.getByRole('tab', { name: 'Contact' })
      expect(contact).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(contact)
      expect(screen.queryByText('Contact content')).not.toBeInTheDocument()
    })

    test('supports controlled selectedKey', async () => {
      const onSelectionChange = vi.fn()
      const { rerender } = render(
        <BasicTabs selectedKey="home" onSelectionChange={onSelectionChange} />
      )
      fireEvent.click(screen.getByRole('tab', { name: 'Profile' }))
      expect(onSelectionChange).toHaveBeenCalledWith('profile')
      // Controlled: selection shouldn't change until the consumer updates `selectedKey`.
      expect(screen.getByText('Home content')).toBeInTheDocument()

      rerender(<BasicTabs selectedKey="profile" onSelectionChange={onSelectionChange} />)
      expect(screen.getByText('Profile content')).toBeInTheDocument()
    })
  })

  describe('styling props', () => {
    test('renders nav-tabs classes by default and nav-pills when requested', async () => {
      const { rerender } = render(<BasicTabs />)
      expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-tabs')

      rerender(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Pills" variant="pills">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-pills')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Tabs ref={ref} defaultSelectedKey="home">
          <TabList aria-label="Example tabs">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<BasicTabs />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
