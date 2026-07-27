import * as React from 'react'
import { act, render, fireEvent } from '@testing-library/react'

import { CxModal } from '../../../index'

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
    </CxModal>
  )
  expect(container).toMatchSnapshot()
  const dialog = container.querySelector('dialog')
  expect(dialog).toHaveClass('bazinga', 'xlarge', 'scrollable', 'max-xlarge:fullscreen')
  expect(dialog).not.toHaveClass('modal-xlarge', 'modal-dialog-scrollable', 'modal-fullscreen')
})

test('CxModal shows via showModal() and locks body scroll, hides and unlocks on close', async () => {
  vi.useFakeTimers()
  const { container, rerender } = render(<CxModal>Test</CxModal>)
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  const showModalSpy = vi.spyOn(dialog, 'showModal')
  const closeSpy = vi.spyOn(dialog, 'close')

  rerender(<CxModal visible>Test</CxModal>)
  expect(showModalSpy).toHaveBeenCalledTimes(1)
  expect(document.documentElement).toHaveStyle({ overflow: 'hidden' })

  rerender(<CxModal visible={false}>Test</CxModal>)
  act(() => {
    vi.runAllTimers()
  })
  expect(closeSpy).toHaveBeenCalledTimes(1)
  expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
  vi.useRealTimers()
})

test('CxModal closes on Escape (modal, native cancel event)', async () => {
  vi.useFakeTimers()
  const onClose = vi.fn()
  const { container } = render(
    <CxModal onClose={onClose} visible>
      Test
    </CxModal>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  expect(onClose).toHaveBeenCalledTimes(0)
  fireEvent(dialog, new Event('cancel', { cancelable: true }))
  act(() => {
    vi.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(1)
  vi.useRealTimers()
})

test('CxModal closes on Escape (non-modal, keydown fallback)', async () => {
  vi.useFakeTimers()
  const onClose = vi.fn()
  const { container } = render(
    <CxModal modal={false} onClose={onClose} visible>
      Test
    </CxModal>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27 })
  act(() => {
    vi.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(1)
  vi.useRealTimers()
})

test('CxModal keyboard=false blocks Escape and bounces instead', async () => {
  vi.useFakeTimers()
  const onClose = vi.fn()
  const onClosePrevented = vi.fn()
  const { container } = render(
    <CxModal keyboard={false} onClose={onClose} onClosePrevented={onClosePrevented} visible>
      Test
    </CxModal>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent(dialog, new Event('cancel', { cancelable: true }))
  expect(onClosePrevented).toHaveBeenCalledTimes(1)
  expect(dialog).toHaveClass('dialog-static')
  act(() => {
    vi.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(0)
  expect(dialog).not.toHaveClass('dialog-static')
  vi.useRealTimers()
})

test('CxModal closes on backdrop click', async () => {
  vi.useFakeTimers()
  const onClose = vi.fn()
  const { container } = render(
    <CxModal onClose={onClose} visible>
      <div>Content</div>
    </CxModal>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent.click(container.querySelector('div') as HTMLDivElement)
  expect(onClose).toHaveBeenCalledTimes(0)
  fireEvent.click(dialog)
  act(() => {
    vi.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(1)
  vi.useRealTimers()
})

test('CxModal restores focus to the trigger element after closing', async () => {
  vi.useFakeTimers()
  function Wrapper() {
    const [visible, setVisible] = React.useState(false)
    return (
      <>
        <button type="button" onClick={() => setVisible(true)}>
          open
        </button>
        <CxModal onClose={() => setVisible(false)} visible={visible}>
          Test
        </CxModal>
      </>
    )
  }
  const { getByText } = render(<Wrapper />)
  const trigger = getByText('open')
  trigger.focus()
  expect(document.activeElement).toBe(trigger)

  fireEvent.click(trigger)

  const dialog = document.querySelector('dialog.modal') as HTMLDialogElement
  fireEvent(dialog, new Event('cancel', { cancelable: true }))
  act(() => {
    vi.runAllTimers()
  })
  expect(document.activeElement).toBe(trigger)
  vi.useRealTimers()
})

test('CxModal backdrop="static" bounces instead of closing on backdrop click', async () => {
  vi.useFakeTimers()
  const onClose = vi.fn()
  const onClosePrevented = vi.fn()
  const { container } = render(
    <CxModal backdrop="static" onClose={onClose} onClosePrevented={onClosePrevented} visible>
      Test
    </CxModal>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent.click(dialog)
  expect(onClosePrevented).toHaveBeenCalledTimes(1)
  expect(dialog).toHaveClass('dialog-static')
  act(() => {
    vi.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(0)
  vi.useRealTimers()
})
