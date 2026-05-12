import * as React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxModal } from '../../../index'

test('loads and displays CxModal component', async () => {
  const { container } = render(<CxModal portal={false}>Test</CxModal>)
  expect(container).toMatchSnapshot()
})

test('CxModal customize', async () => {
  const { container } = render(
    <CxModal
      alignment="center"
      className="bazinga"
      duration={100}
      fullscreen="xlarge"
      scrollable={true}
      size="xlarge"
      visible={true}
    >
      Test
    </CxModal>,
  )
  expect(container).toMatchSnapshot()
})

test('CxModal dialog close on press ESC', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  render(
    <CxModal onClose={onClose} portal={false} visible>
      Test
    </CxModal>,
  )
  expect(onClose).toHaveBeenCalledTimes(0)
  const modal = document.querySelector('.modal')
  if (modal !== null) {
    fireEvent.keyDown(modal, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    })
  }
  jest.runAllTimers()
  expect(onClose).toHaveBeenCalledTimes(1)
  jest.useRealTimers()
})

// test('CxModal dialog close on backdrop', async () => {
//   jest.useFakeTimers()
//   const onClose = jest.fn()
//   render(
//     <CxModal onClose={onClose} portal={false} visible={true}>
//       Test
//     </CxModal>,
//   )
//   expect(onClose).toHaveBeenCalledTimes(0)
//   const backdrop = document.querySelector('.modal-backdrop')
//   if (backdrop !== null) {
//     fireEvent.click(backdrop)
//   }
//   jest.runAllTimers()
//   expect(onClose).toHaveBeenCalledTimes(1)
//   jest.useRealTimers()
// })
