import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NavOverflow, Tabs, TabList, Tab, TabPanel } from '../../../src/index'
import { pendingLazyNode } from '../../utils/lazyNode'

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

// react-stately's collection keys are strings; an `id` is a `Key`, so it may be a number.
const NumericTabs = (props: Partial<React.ComponentProps<typeof Tabs>> = {}) => (
  <Tabs {...props}>
    <TabList aria-label="Numbered tabs">
      <Tab id={1} disabled>
        One
      </Tab>
      <Tab id={2}>Two</Tab>
      <Tab id={3}>Three</Tab>
    </TabList>
    <TabPanel id={1}>Panel one</TabPanel>
    <TabPanel id={2}>Panel two</TabPanel>
    <TabPanel id={3}>Panel three</TabPanel>
  </Tabs>
)

describe('Tabs', () => {
  describe('numeric ids', () => {
    test('selects the first enabled tab, shows its panel and reports its id as given', () => {
      const onSelectionChange = vi.fn()
      render(<NumericTabs onSelectionChange={onSelectionChange} />)

      expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
      const panel = screen.getByRole('tabpanel')
      expect(panel).toHaveTextContent('Panel two')
      expect(panel).toHaveAccessibleName('Two')
      expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-controls', panel.id)
      expect(onSelectionChange).toHaveBeenCalledTimes(1)
      expect(onSelectionChange).toHaveBeenCalledWith(2)
    })

    test('keeps a disabled tab from being selected', () => {
      const onSelectionChange = vi.fn()
      render(<NumericTabs defaultSelectedKey={2} onSelectionChange={onSelectionChange} />)

      const one = screen.getByRole('tab', { name: 'One' })
      expect(one).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(one)
      expect(onSelectionChange).not.toHaveBeenCalled()
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two')
    })

    test('takes disabledKeys, defaultSelectedKey and a controlled selectedKey as numbers', () => {
      function Controlled() {
        const [selected, setSelected] = React.useState<string | number>(3)
        return (
          <>
            <NumericTabs
              disabledKeys={[2]}
              selectedKey={selected}
              onSelectionChange={setSelected}
            />
            <output>{typeof selected}</output>
          </>
        )
      }
      render(<Controlled />)

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel three')
      const two = screen.getByRole('tab', { name: 'Two' })
      expect(two).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(two)
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel three')
      expect(screen.getByRole('status')).toHaveTextContent('number')
    })

    test('reports the id of a clicked tab as a number', () => {
      const onSelectionChange = vi.fn()
      render(<NumericTabs defaultSelectedKey={2} onSelectionChange={onSelectionChange} />)

      fireEvent.click(screen.getByRole('tab', { name: 'Three' }))
      expect(onSelectionChange).toHaveBeenCalledWith(3)
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel three')
    })
  })

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

  describe('a TabList inside another element', () => {
    // What `NavOverflow` needs: the element around the list is rendered where the list would be.
    test('finds the list one level down and keeps its wrapper out of the panels', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <div data-testid="bar">
            <TabList aria-label="Sections">
              <Tab id="home">Home</Tab>
              <Tab id="profile">Profile</Tab>
            </TabList>
            <button type="button">New</button>
          </div>
          <TabPanel id="home">Home content</TabPanel>
          <TabPanel id="profile">Profile content</TabPanel>
        </Tabs>
      )
      const bar = screen.getByTestId('bar')
      expect(bar).toContainElement(screen.getByRole('tablist'))
      expect(bar).toContainElement(screen.getByRole('button', { name: 'New' }))
      expect(screen.getAllByRole('tab')).toHaveLength(2)
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Home content')
      expect(bar).not.toContainElement(screen.getByRole('tabpanel'))
    })
  })

  describe('finding the TabList', () => {
    test('finds it two levels down, under an asChild wrapper', () => {
      render(
        <Tabs defaultSelectedKey="home">
          <NavOverflow asChild>
            <section data-testid="bar">
              <TabList aria-label="Sections">
                <Tab id="home">Home</Tab>
              </TabList>
            </section>
          </NavOverflow>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(screen.getByTestId('bar')).toContainElement(screen.getByRole('tablist'))
      expect(screen.getByTestId('bar')).toHaveClass('nav-overflow')
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Home content')
    })

    // Looking for the list in a panel would read the panel's children, and wait for content
    // that isn't shown.
    test('does not wait for the content of a panel written before the list', () => {
      const pending = pendingLazyNode(<p>Loading content</p>)
      render(
        <React.Suspense fallback={<p>Waiting</p>}>
          <Tabs defaultSelectedKey="b">
            <TabPanel id="a">{pending.node}</TabPanel>
            <TabList aria-label="Sections">
              <Tab id="a">A</Tab>
              <Tab id="b">B</Tab>
            </TabList>
            <TabPanel id="b">Panel B</TabPanel>
          </Tabs>
        </React.Suspense>
      )
      expect(screen.queryByText('Waiting')).not.toBeInTheDocument()
      expect(screen.getAllByRole('tab')).toHaveLength(2)
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B')
    })
  })

  describe('tab selection', () => {
    test('with no key given, reports the first enabled tab through onSelectionChange on mount', () => {
      const onSelectionChange = vi.fn()
      render(<BasicTabs defaultSelectedKey={undefined} onSelectionChange={onSelectionChange} />)
      expect(onSelectionChange).toHaveBeenCalledTimes(1)
      expect(onSelectionChange).toHaveBeenCalledWith('home')
      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true')
    })

    test('with a key given, reports nothing on mount', () => {
      const onSelectionChange = vi.fn()
      render(<BasicTabs onSelectionChange={onSelectionChange} />)
      expect(onSelectionChange).not.toHaveBeenCalled()
    })

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
    test('renders nav-tabs classes by default and nav-segments when requested', async () => {
      const { rerender } = render(<BasicTabs />)
      expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-tabs')

      rerender(
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Segments" variant="segments">
            <Tab id="home">Home</Tab>
          </TabList>
          <TabPanel id="home">Home content</TabPanel>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-segments')
    })
  })

  describe('orientation', () => {
    test('a vertical list is stacked, and the up and down arrow keys move between its tabs', () => {
      render(<BasicTabs orientation="vertical" />)
      const list = screen.getByRole('tablist')
      expect(list).toHaveAttribute('aria-orientation', 'vertical')
      expect(list).toHaveClass('nav', 'nav-tabs', 'flex-column')

      const home = screen.getByRole('tab', { name: 'Home' })
      act(() => home.focus())
      fireEvent.keyDown(home, { key: 'ArrowDown' })
      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus()
    })

    test('a horizontal list is not stacked', () => {
      render(<BasicTabs />)
      expect(screen.getByRole('tablist')).not.toHaveClass('flex-column')
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
