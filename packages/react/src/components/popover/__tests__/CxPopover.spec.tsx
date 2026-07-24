import * as React from 'react'
import { act, render, fireEvent } from '@testing-library/react'

import { CxPopover, CxButton } from '../../../index'

test('loads and displays CxPopover component', async () => {
  const { container } = render(
    <CxPopover content="A">
      <CxButton>Test</CxButton>
    </CxPopover>,
  )
  expect(container).toMatchSnapshot()
})

test('CxPopover customize', async () => {
  jest.useFakeTimers()
  let arr, element
  render(
    <CxPopover content="content" title="title" placement="right">
      <CxButton>Test</CxButton>
    </CxPopover>,
  )
  const btn = document.querySelector('.button')
  act(() => {
    if (btn !== null) {
      fireEvent.click(btn)
    }
  })
  act(() => jest.runAllTimers())
  expect(document.body).toMatchSnapshot()
  let arrLength = document.body.getElementsByClassName('popover').length
  expect(arrLength).toBe(1)
  arrLength = document.body.getElementsByClassName('cx-popover-auto').length
  expect(arrLength).toBe(1)
  arrLength = document.body.getElementsByClassName('popover-arrow').length
  expect(arrLength).toBe(1)
  arrLength = document.body.getElementsByClassName('popover-header').length
  expect(arrLength).toBe(1)
  arrLength = document.body.getElementsByClassName('popover-body').length
  expect(arrLength).toBe(1)
  arr = document.body.getElementsByClassName('popover-header')
  if (arr.length > 0) {
    element = arr[0]
    expect(element.innerHTML).toBe('title')
  } else {
    expect(true).toBe(false)
  }
  arr = document.body.getElementsByClassName('popover-body')
  if (arr.length > 0) {
    element = arr[0]
    expect(element.innerHTML).toBe('content')
  } else {
    expect(true).toBe(false)
  }
  jest.useRealTimers()
})

test('CxPopover scopes itself to an open dialog ancestor', async () => {
  jest.useFakeTimers()
  render(
    <dialog open>
      <CxPopover content="content">
        <CxButton>Test</CxButton>
      </CxPopover>
    </dialog>,
  )
  const btn = document.querySelector('.button')
  act(() => {
    if (btn !== null) {
      fireEvent.click(btn)
    }
  })
  act(() => jest.runAllTimers())
  const dialog = document.body.querySelector('dialog')
  const popover = document.body.querySelector('.popover')
  expect(popover).not.toBeNull()
  expect(dialog?.contains(popover)).toBe(true)
  jest.useRealTimers()
})

test('CxPopover responds to the visible prop changing after mount', async () => {
  jest.useFakeTimers()
  const { rerender } = render(
    <CxPopover content="content" visible={false}>
      <CxButton>Test</CxButton>
    </CxPopover>,
  )
  act(() => jest.runAllTimers())
  expect(document.body.getElementsByClassName('popover').length).toBe(0)

  rerender(
    <CxPopover content="content" visible={true}>
      <CxButton>Test</CxButton>
    </CxPopover>,
  )
  act(() => jest.runAllTimers())
  expect(document.body.getElementsByClassName('popover').length).toBe(1)

  rerender(
    <CxPopover content="content" visible={false}>
      <CxButton>Test</CxButton>
    </CxPopover>,
  )
  act(() => jest.runAllTimers())
  expect(document.body.getElementsByClassName('popover').length).toBe(0)
  jest.useRealTimers()
})

test('CxPopover preserves the trigger child\'s own onClick handler', async () => {
  jest.useFakeTimers()
  const onClick = jest.fn()
  render(
    <CxPopover content="content">
      <CxButton onClick={onClick}>Test</CxButton>
    </CxPopover>,
  )
  const btn = document.querySelector('.button') as HTMLElement
  act(() => {
    fireEvent.click(btn)
  })
  act(() => jest.runAllTimers())
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(document.body.getElementsByClassName('popover').length).toBe(1)
  jest.useRealTimers()
})

test('CxPopover moves focus into the dialog on open', async () => {
  jest.useFakeTimers()
  render(
    <CxPopover content="content" title="title">
      <CxButton>Test</CxButton>
    </CxPopover>,
  )
  const btn = document.querySelector('.button') as HTMLElement
  act(() => {
    fireEvent.click(btn)
  })
  act(() => jest.runAllTimers())
  const popover = document.body.querySelector('.popover')
  expect(document.activeElement).toBe(popover)
  jest.useRealTimers()
})
