import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { CxMenu, CxMenuList, CxMenuItem, CxSubmenu, CxSubmenuBack } from '../../../index'

test('CxSubmenu closes when its ancestor CxMenu closes', async () => {
  const { rerender } = render(
    <CxMenu visible>
      <CxMenuList>
        <CxSubmenu trigger="File">
          <CxMenuItem>New</CxMenuItem>
        </CxSubmenu>
      </CxMenuList>
    </CxMenu>
  )
  const nestedMenu = screen.getByText('New').closest('.menu') as HTMLElement

  fireEvent.click(screen.getByText('File'))
  expect(nestedMenu).toHaveClass('show')

  rerender(
    <CxMenu visible={false}>
      <CxMenuList>
        <CxSubmenu trigger="File">
          <CxMenuItem>New</CxMenuItem>
        </CxSubmenu>
      </CxMenuList>
    </CxMenu>
  )
  expect(nestedMenu).not.toHaveClass('show')
})

test('loads and displays CxSubmenu component', async () => {
  const { container } = render(
    <CxMenu visible>
      <CxMenuList>
        <CxSubmenu trigger="File">
          <CxMenuItem>New</CxMenuItem>
          <CxMenuItem>Open</CxMenuItem>
        </CxSubmenu>
      </CxMenuList>
    </CxMenu>
  )
  expect(container).toMatchSnapshot()
  expect(document.querySelector('.submenu')).not.toBeNull()
})

test('CxSubmenu forwards ref to the outer wrapper element', async () => {
  const ref = React.createRef<HTMLDivElement>()
  render(
    <CxMenu visible>
      <CxMenuList>
        <CxSubmenu ref={ref} trigger="File">
          <CxMenuItem>New</CxMenuItem>
        </CxSubmenu>
      </CxMenuList>
    </CxMenu>
  )
  expect(ref.current).toBeInstanceOf(HTMLDivElement)
  expect(ref.current).toHaveClass('submenu')
})

test('CxSubmenu opens and closes on trigger click', async () => {
  render(
    <CxMenu visible>
      <CxMenuList>
        <CxSubmenu trigger="File">
          <CxMenuItem>New</CxMenuItem>
        </CxSubmenu>
      </CxMenuList>
    </CxMenu>
  )
  const trigger = screen.getByText('File')
  const nestedMenu = screen.getByText('New').closest('.menu') as HTMLElement

  expect(nestedMenu).not.toHaveClass('show')
  fireEvent.click(trigger)
  expect(nestedMenu).toHaveClass('show')
  expect(trigger).toHaveAttribute('aria-expanded', 'true')

  fireEvent.click(trigger)
  expect(nestedMenu).not.toHaveClass('show')
})

test('CxSubmenu closes sibling submenus when a new one opens', async () => {
  render(
    <CxMenu visible>
      <CxMenuList>
        <CxSubmenu trigger="File">
          <CxMenuItem>New</CxMenuItem>
        </CxSubmenu>
        <CxSubmenu trigger="Edit">
          <CxMenuItem>Cut</CxMenuItem>
        </CxSubmenu>
      </CxMenuList>
    </CxMenu>
  )
  const fileMenu = screen.getByText('New').closest('.menu') as HTMLElement
  const editMenu = screen.getByText('Cut').closest('.menu') as HTMLElement

  fireEvent.click(screen.getByText('File'))
  expect(fileMenu).toHaveClass('show')

  fireEvent.click(screen.getByText('Edit'))
  expect(editMenu).toHaveClass('show')
  expect(fileMenu).not.toHaveClass('show')
})

test('CxSubmenuBack closes the submenu and refocuses its trigger', async () => {
  render(
    <CxMenu visible>
      <CxMenuList>
        <CxSubmenu trigger="File" stacked>
          <CxSubmenuBack>Back</CxSubmenuBack>
          <CxMenuItem>New</CxMenuItem>
        </CxSubmenu>
      </CxMenuList>
    </CxMenu>
  )
  const trigger = screen.getByText('File')
  const nestedMenu = screen.getByText('New').closest('.menu') as HTMLElement

  fireEvent.click(trigger)
  expect(nestedMenu).toHaveClass('show')

  fireEvent.click(screen.getByText('Back'))
  expect(nestedMenu).not.toHaveClass('show')
  expect(trigger).toHaveFocus()
})
