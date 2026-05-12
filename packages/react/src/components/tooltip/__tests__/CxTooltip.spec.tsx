import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CxTooltip, CxLink } from '../../../index'

let container: HTMLDivElement | null
let root: ReturnType<typeof createRoot> | null

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => {
    root?.unmount()
  })
  container && document.body.removeChild(container)
  container = null
  root = null
})

test('loads and displays CxTooltip component', async () => {
  act(() => {
    root!.render(
      <CxTooltip content="content">
        <CxLink>Test</CxLink>
      </CxTooltip>,
    )
  })
  expect(container).toMatchSnapshot()
})

test('CxTooltip customize', async () => {
  act(() => {
    root!.render(
      <CxTooltip trigger="hover" placement="right" content="content">
        <CxLink className="link">Test</CxLink>
      </CxTooltip>,
    )
  })
  const link = document.querySelector('.link')
  act(() => {
    if (link !== null) {
      fireEvent.mouseOver(link)
    }
  })
  expect(container).toMatchSnapshot()
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
