import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '../../../index'

test('loads and displays CxMenu component', async () => {
  const { container } = render(<CxMenu>Test</CxMenu>)
  expect(container).toMatchSnapshot()
})

test('CxMenu customize', async () => {
  const { container } = render(
    <CxMenu className="bazinga" component="h3" placement="right-end" visible={true}>
      Test
    </CxMenu>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
})

test('CxMenu change visible prop', async () => {
  render(
    <CxMenu visible={false}>
      <CxMenuToggle>Toggle</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem>A</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  const menu = document.querySelector('.menu')
  expect(menu).not.toHaveClass('show')
})

test('CxMenu click toggles the menu and closes on outside click', async () => {
  jest.useFakeTimers()
  render(
    <CxMenu>
      <CxMenuToggle>Toggle</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem>A</CxMenuItem>
        <CxMenuItem>B</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  const toggle = screen.getByText('Toggle')
  const menu = document.querySelector('.menu')
  expect(menu).not.toHaveClass('show')

  fireEvent.click(toggle)
  expect(menu).toHaveClass('show')
  expect(toggle).toHaveAttribute('aria-expanded', 'true')

  jest.runAllTimers()
  fireEvent.click(document)
  expect(menu).not.toHaveClass('show')
  jest.useRealTimers()
})

test('CxMenu autoClose="inside" only closes on clicks inside the menu', async () => {
  jest.useFakeTimers()
  render(
    <CxMenu autoClose="inside">
      <CxMenuToggle>Toggle</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem>A</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  fireEvent.click(screen.getByText('Toggle'))
  const menu = document.querySelector('.menu') as HTMLElement
  jest.runAllTimers()

  fireEvent.click(document.body)
  expect(menu).toHaveClass('show')

  fireEvent.click(screen.getByText('A'))
  expect(menu).not.toHaveClass('show')
  jest.useRealTimers()
})

test('CxMenu autoClose={false} never closes automatically', async () => {
  jest.useFakeTimers()
  render(
    <CxMenu autoClose={false}>
      <CxMenuToggle>Toggle</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem>A</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  fireEvent.click(screen.getByText('Toggle'))
  const menu = document.querySelector('.menu') as HTMLElement
  jest.runAllTimers()
  fireEvent.click(document.body)
  expect(menu).toHaveClass('show')
  jest.useRealTimers()
})

test('CxMenu example', async () => {
  const { container } = render(
    <CxMenu visible>
      <CxMenuToggle>Test</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem>A</CxMenuItem>
        <CxMenuItem>B</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  expect(container).toMatchSnapshot()
})
