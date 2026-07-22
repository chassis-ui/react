import * as React from 'react'
import { act, render, fireEvent } from '@testing-library/react'

import { CxModal } from '../../../index'

afterEach(() => {
  document.body.classList.remove('dialog-open')
})

test('loads and displays CxModal component', async () => {
  const { container } = render(<CxModal>Test</CxModal>)
  expect(container).toMatchSnapshot()
  const dialog = container.querySelector('dialog')
  expect(dialog).toHaveClass('modal', 'dialog')
  expect(dialog).not.toHaveAttribute('open')
})

test('CxModal customize', async () => {
  const { container } = render(
    <CxModal className="bazinga" fullscreen="xlarge" scrollable size="xlarge" visible>
      Test
    </CxModal>,
  )
  expect(container).toMatchSnapshot()
  const dialog = container.querySelector('dialog')
  expect(dialog).toHaveClass('bazinga', 'xlarge', 'scrollable', 'max-xlarge:fullscreen')
  expect(dialog).not.toHaveClass('modal-xlarge', 'modal-dialog-scrollable', 'modal-fullscreen')
})

test('CxModal shows via showModal() and locks body scroll, hides and unlocks on close', async () => {
  jest.useFakeTimers()
  const { container, rerender } = render(<CxModal>Test</CxModal>)
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  const showModalSpy = jest.spyOn(dialog, 'showModal')
  const closeSpy = jest.spyOn(dialog, 'close')

  rerender(<CxModal visible>Test</CxModal>)
  expect(showModalSpy).toHaveBeenCalledTimes(1)
  expect(document.body).toHaveClass('dialog-open')

  rerender(<CxModal visible={false}>Test</CxModal>)
  act(() => {
    jest.runAllTimers()
  })
  expect(closeSpy).toHaveBeenCalledTimes(1)
  expect(document.body).not.toHaveClass('dialog-open')
  jest.useRealTimers()
})

test('CxModal closes on Escape (modal, native cancel event)', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  const { container } = render(
    <CxModal onClose={onClose} visible>
      Test
    </CxModal>,
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  expect(onClose).toHaveBeenCalledTimes(0)
  fireEvent(dialog, new Event('cancel', { cancelable: true }))
  act(() => {
    jest.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(1)
  jest.useRealTimers()
})

test('CxModal closes on Escape (non-modal, keydown fallback)', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  const { container } = render(
    <CxModal modal={false} onClose={onClose} visible>
      Test
    </CxModal>,
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27 })
  act(() => {
    jest.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(1)
  jest.useRealTimers()
})

test('CxModal keyboard=false blocks Escape and bounces instead', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  const onClosePrevented = jest.fn()
  const { container } = render(
    <CxModal keyboard={false} onClose={onClose} onClosePrevented={onClosePrevented} visible>
      Test
    </CxModal>,
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent(dialog, new Event('cancel', { cancelable: true }))
  expect(onClosePrevented).toHaveBeenCalledTimes(1)
  expect(dialog).toHaveClass('dialog-static')
  act(() => {
    jest.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(0)
  expect(dialog).not.toHaveClass('dialog-static')
  jest.useRealTimers()
})

test('CxModal closes on backdrop click', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  const { container } = render(
    <CxModal onClose={onClose} visible>
      <div>Content</div>
    </CxModal>,
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent.click(container.querySelector('div') as HTMLDivElement)
  expect(onClose).toHaveBeenCalledTimes(0)
  fireEvent.click(dialog)
  act(() => {
    jest.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(1)
  jest.useRealTimers()
})

test('CxModal backdrop="static" bounces instead of closing on backdrop click', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  const onClosePrevented = jest.fn()
  const { container } = render(
    <CxModal backdrop="static" onClose={onClose} onClosePrevented={onClosePrevented} visible>
      Test
    </CxModal>,
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent.click(dialog)
  expect(onClosePrevented).toHaveBeenCalledTimes(1)
  expect(dialog).toHaveClass('dialog-static')
  act(() => {
    jest.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(0)
  jest.useRealTimers()
})
