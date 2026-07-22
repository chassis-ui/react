import * as React from 'react'
import { act, render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CxTooltip, CxLink } from '../../../index'

test('loads and displays CxTooltip component', async () => {
  const { container } = render(
    <CxTooltip content="content">
      <CxLink>Test</CxLink>
    </CxTooltip>,
  )
  expect(container).toMatchSnapshot()
})

test('CxTooltip customize', async () => {
  jest.useFakeTimers()
  const { container } = render(
    <CxTooltip trigger="hover" placement="right" content="content">
      <CxLink className="link">Test</CxLink>
    </CxTooltip>,
    { container: document.body },
  )
  const link = document.querySelector('.link')
  act(() => {
    if (link !== null) {
      fireEvent.mouseOver(link)
    }
  })
  jest.runAllTimers()
  expect(container).toMatchSnapshot()
  expect(container.getElementsByClassName('tooltip').length).toBe(1)
  expect(container.getElementsByClassName('cx-tooltip-auto').length).toBe(1)
  expect(container.getElementsByClassName('tooltip-arrow').length).toBe(1)
  const inner = container.getElementsByClassName('tooltip-inner')
  expect(inner.length).toBe(1)
  expect(inner[0].innerHTML).toBe('content')
  const tooltip = container.getElementsByClassName('tooltip')[0]
  expect(tooltip.getAttribute('data-cx-placement')).toBeTruthy()
  jest.useRealTimers()
})

test('CxTooltip scopes itself to an open dialog ancestor', async () => {
  jest.useFakeTimers()
  const { container } = render(
    <dialog open>
      <CxTooltip trigger="hover" content="content">
        <CxLink className="link">Test</CxLink>
      </CxTooltip>
    </dialog>,
    { container: document.body },
  )
  const link = document.querySelector('.link')
  act(() => {
    if (link !== null) {
      fireEvent.mouseOver(link)
    }
  })
  jest.runAllTimers()
  const dialog = container.querySelector('dialog')
  const tooltip = container.querySelector('.tooltip')
  expect(tooltip).not.toBeNull()
  expect(dialog?.contains(tooltip)).toBe(true)
  jest.useRealTimers()
})

// test('CxTooltip on toggle', async () => {
//   jest.useFakeTimers()
//   const onToggle = jest.fn()
//   render(
//     <CxTooltip
//       trigger="click"
//       placement="right-end"
//       content="content"
//       visible={true}
//       onToggle={onToggle}
//     >
//       <CxButton>Test</CxButton>
//     </CxTooltip>,
//   )
//   expect(onToggle).toHaveBeenCalledTimes(0)
//   const btn = document.querySelector('.btn')
//   if (btn !== null) {
//     fireEvent.click(btn)
//   }
//   expect(onToggle).toHaveBeenCalledTimes(1)
// })
