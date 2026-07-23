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
    <CxPopover content="content" title="title" trigger="click" placement="right">
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
      <CxPopover content="content" trigger="click">
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

// test('CxPopover onToggle', async () => {
//   let btn
//   jest.useFakeTimers()
//   const onToggle = jest.fn()
//   render(
//     <CxPopover onToggle={onToggle} content="content" trigger="click">
//       <CxButton>Test</CxButton>
//     </CxPopover>,
//   )
//   expect(onToggle).toHaveBeenCalledTimes(0)
//   btn = document.querySelector('.btn')
//   if (btn !== null) {
//     fireEvent.click(btn)
//   }
//   jest.runAllTimers()
//   expect(onToggle).toHaveBeenCalledTimes(1)
//   btn = document.querySelector('.btn')
//   if (btn !== null) {
//     fireEvent.click(btn)
//   }
//   jest.runAllTimers()
//   expect(onToggle).toHaveBeenCalledTimes(2)
//   jest.useRealTimers()
// })

//TODO: test visible on focus, click and mouseEnter
