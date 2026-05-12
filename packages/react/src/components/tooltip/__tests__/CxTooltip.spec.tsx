import * as React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxTooltip, CxLink } from '../../../index'

let container: HTMLDivElement | null

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  container && document.body.removeChild(container)
  container = null
})

test('loads and displays CxTooltip component', async () => {
  ReactDOM.render(
    <CxTooltip content="content">
      <CxLink>Test</CxLink>
    </CxTooltip>,
    container,
  )
  expect(container).toMatchSnapshot()
})

test('CxTooltip customize', async () => {
  act(() => {
    ReactDOM.render(
      <CxTooltip trigger="hover" placement="right" content="content">
        <CxLink className="link">Test</CxLink>
      </CxTooltip>,
      container,
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
