import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'

import { CxTabs, CxTabList, CxTab, CxTabPanel } from '../../../index'

const BasicTabs = (props: Partial<React.ComponentProps<typeof CxTabs>> = {}) => (
  <CxTabs defaultSelectedKey="home" {...props}>
    <CxTabList aria-label="Example tabs">
      <CxTab id="home">Home</CxTab>
      <CxTab id="profile">Profile</CxTab>
      <CxTab id="contact" disabled>
        Contact
      </CxTab>
    </CxTabList>
    <CxTabPanel id="home">Home content</CxTabPanel>
    <CxTabPanel id="profile">Profile content</CxTabPanel>
    <CxTabPanel id="contact">Contact content</CxTabPanel>
  </CxTabs>
)

test('renders tabs with correct ARIA roles', async () => {
  render(<BasicTabs />)
  expect(screen.getByRole('tablist', { name: 'Example tabs' })).toBeInTheDocument()
  const tabs = screen.getAllByRole('tab')
  expect(tabs).toHaveLength(3)
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Home content')
})

test('only renders the panel for the selected tab', async () => {
  render(<BasicTabs />)
  expect(screen.getByText('Home content')).toBeInTheDocument()
  expect(screen.queryByText('Profile content')).not.toBeInTheDocument()
  expect(screen.queryByText('Contact content')).not.toBeInTheDocument()
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
  const onSelectionChange = jest.fn()
  const { rerender } = render(
    <BasicTabs selectedKey="home" onSelectionChange={onSelectionChange} />,
  )
  fireEvent.click(screen.getByRole('tab', { name: 'Profile' }))
  expect(onSelectionChange).toHaveBeenCalledWith('profile')
  // Controlled: selection shouldn't change until the consumer updates `selectedKey`.
  expect(screen.getByText('Home content')).toBeInTheDocument()

  rerender(<BasicTabs selectedKey="profile" onSelectionChange={onSelectionChange} />)
  expect(screen.getByText('Profile content')).toBeInTheDocument()
})

test('renders nav-tabs classes by default and nav-pills when requested', async () => {
  const { rerender } = render(<BasicTabs />)
  expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-tabs')

  rerender(
    <CxTabs defaultSelectedKey="home">
      <CxTabList aria-label="Pills" variant="pills">
        <CxTab id="home">Home</CxTab>
      </CxTabList>
      <CxTabPanel id="home">Home content</CxTabPanel>
    </CxTabs>,
  )
  expect(screen.getByRole('tablist')).toHaveClass('nav', 'nav-pills')
})
