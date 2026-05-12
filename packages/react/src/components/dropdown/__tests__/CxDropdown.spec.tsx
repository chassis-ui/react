import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import {
  CxDropdown,
  CxDropdownToggle,
  CxDropdownMenu,
  CxDropdownItem,
  CxDropdownItemPlain,
  CxDropdownHeader,
  CxDropdownDivider,
} from '../../../index'

test('loads and displays CxDropdown component', async () => {
  const { container } = render(<CxDropdown>Test</CxDropdown>)
  expect(container).toMatchSnapshot()
})

test('CxDropdown customize', async () => {
  const { container } = render(
    <CxDropdown
      alignment={{ large: 'start' }}
      className="bazinga"
      component="h3"
      dark={true}
      direction="dropstart"
      placement="right-end"
      popper={true}
      variant="nav-item"
      visible={true}
    >
      Test
    </CxDropdown>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('nav-item')
  expect(container.firstChild).toHaveClass('dropdown')
  expect(container.firstChild).toHaveClass('dropstart')
  expect(container.firstChild).toHaveClass('show')
})

test('CxDropdown change visible prop', async () => {
  jest.useFakeTimers()
  const { rerender } = render(<CxDropdown visible={false}>Test</CxDropdown>)
  expect(screen.getByText('Test')).not.toHaveClass('show')
  rerender(<CxDropdown visible={true}>Test</CxDropdown>)
  jest.runAllTimers()
  expect(screen.getByText('Test')).toHaveClass('show')
  rerender(<CxDropdown visible={false}>Test</CxDropdown>)
  expect(screen.getByText('Test')).not.toHaveClass('show')
  jest.runAllTimers()
  jest.useRealTimers()
})

test('CxDropdown click', async () => {
  jest.useFakeTimers()
  render(
    <CxDropdown>
      <CxDropdownToggle>Test</CxDropdownToggle>
      <CxDropdownMenu>
        <CxDropdownItem>A</CxDropdownItem>
        <CxDropdownItem>B</CxDropdownItem>
      </CxDropdownMenu>
    </CxDropdown>,
  )
  expect(screen.getByText('Test')).not.toHaveClass('show')
  const el = screen.getByText('Test')
  if (el !== null) {
    fireEvent.click(el) //click on element
  }
  jest.runAllTimers()
  expect(screen.getByText('Test').closest('div')).toHaveClass('show')
  fireEvent.click(document) //click outside
  expect(screen.getByText('Test').closest('div')).not.toHaveClass('show')
  jest.runAllTimers()
  jest.useRealTimers()
})

test('CxDropdown example', async () => {
  jest.useFakeTimers()
  const { container } = render(
    <CxDropdown>
      <CxDropdownToggle>Test</CxDropdownToggle>
      <CxDropdownMenu>
        <CxDropdownHeader>A</CxDropdownHeader>
        <CxDropdownItem>B</CxDropdownItem>
        <CxDropdownItemPlain>C</CxDropdownItemPlain>
        <CxDropdownDivider />
        <CxDropdownItem>D</CxDropdownItem>
      </CxDropdownMenu>
    </CxDropdown>,
  )
  expect(container).toMatchSnapshot()
})
