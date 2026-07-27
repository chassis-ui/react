import * as React from 'react'
import { act, render, fireEvent } from '@testing-library/react'

import { CxDrawer } from '../../../index'

test('loads and displays CxDrawer component', async () => {
  const { container } = render(<CxDrawer placement="start">Test</CxDrawer>)
  expect(container).toMatchSnapshot()
  const dialog = container.querySelector('dialog')
  expect(dialog).toHaveClass('drawer', 'drawer-start')
  expect(dialog).not.toHaveAttribute('open')
})

test('CxDrawer customize', async () => {
  const { container } = render(
    <CxDrawer
      className="bazinga"
      fitContent
      fullscreen
      placement="bottom"
      responsive="large"
      sheet
      translucent
      visible
    >
      Test
    </CxDrawer>
  )
  expect(container).toMatchSnapshot()
  const dialog = container.querySelector('dialog')
  expect(dialog).toHaveClass(
    'bazinga',
    'max-large:drawer',
    'drawer-bottom',
    'fullscreen',
    'sheet',
    'translucent',
    'drawer-fit-content'
  )
  expect(dialog).not.toHaveClass('drawer')
})

test('CxDrawer shows via showModal() and locks body scroll, hides and unlocks on close', async () => {
  jest.useFakeTimers()
  const { container, rerender } = render(<CxDrawer placement="start">Test</CxDrawer>)
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  const showModalSpy = jest.spyOn(dialog, 'showModal')
  const closeSpy = jest.spyOn(dialog, 'close')

  rerender(
    <CxDrawer placement="start" visible>
      Test
    </CxDrawer>
  )
  expect(showModalSpy).toHaveBeenCalledTimes(1)
  expect(document.documentElement).toHaveStyle({ overflow: 'hidden' })

  rerender(
    <CxDrawer placement="start" visible={false}>
      Test
    </CxDrawer>
  )
  // Drawer closes immediately (no deferred/.hiding step, unlike Modal)
  expect(closeSpy).toHaveBeenCalledTimes(1)
  expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
  act(() => {
    jest.runAllTimers()
  })
  jest.useRealTimers()
})

test('CxDrawer with scroll and no backdrop opens non-modally via show()', async () => {
  const { container } = render(
    <CxDrawer backdrop={false} placement="start" scroll visible>
      Test
    </CxDrawer>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  expect(dialog).toHaveClass('nonmodal')
  expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
})

test('CxDrawer closes on Escape (modal, native cancel event)', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  const { container } = render(
    <CxDrawer onClose={onClose} placement="start" visible>
      Test
    </CxDrawer>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  expect(onClose).toHaveBeenCalledTimes(0)
  fireEvent(dialog, new Event('cancel', { cancelable: true }))
  expect(onClose).toHaveBeenCalledTimes(1)
  act(() => {
    jest.runAllTimers()
  })
  jest.useRealTimers()
})

test('CxDrawer closes on Escape (non-modal, keydown fallback)', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  const { container } = render(
    <CxDrawer backdrop={false} onClose={onClose} placement="start" scroll visible>
      Test
    </CxDrawer>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27 })
  expect(onClose).toHaveBeenCalledTimes(1)
  act(() => {
    jest.runAllTimers()
  })
  jest.useRealTimers()
})

test('CxDrawer keyboard=false blocks Escape and bounces instead', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  const onClosePrevented = jest.fn()
  const { container } = render(
    <CxDrawer
      keyboard={false}
      onClose={onClose}
      onClosePrevented={onClosePrevented}
      placement="start"
      visible
    >
      Test
    </CxDrawer>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent(dialog, new Event('cancel', { cancelable: true }))
  expect(onClosePrevented).toHaveBeenCalledTimes(1)
  expect(dialog).toHaveClass('static')
  act(() => {
    jest.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(0)
  expect(dialog).not.toHaveClass('static')
  jest.useRealTimers()
})

test('CxDrawer closes on backdrop click', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  const { container } = render(
    <CxDrawer onClose={onClose} placement="start" visible>
      <div>Content</div>
    </CxDrawer>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent.click(container.querySelector('div') as HTMLDivElement)
  expect(onClose).toHaveBeenCalledTimes(0)
  fireEvent.click(dialog)
  expect(onClose).toHaveBeenCalledTimes(1)
  act(() => {
    jest.runAllTimers()
  })
  jest.useRealTimers()
})

test('CxDrawer backdrop="static" bounces instead of closing on backdrop click', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  const onClosePrevented = jest.fn()
  const { container } = render(
    <CxDrawer
      backdrop="static"
      onClose={onClose}
      onClosePrevented={onClosePrevented}
      placement="start"
      visible
    >
      Test
    </CxDrawer>
  )
  const dialog = container.querySelector('dialog') as HTMLDialogElement
  fireEvent.click(dialog)
  expect(onClosePrevented).toHaveBeenCalledTimes(1)
  expect(dialog).toHaveClass('static')
  act(() => {
    jest.runAllTimers()
  })
  expect(onClose).toHaveBeenCalledTimes(0)
  jest.useRealTimers()
})

test('CxDrawer auto-closes another open drawer', async () => {
  jest.useFakeTimers()
  const onCloseA = jest.fn()
  function Wrapper() {
    const [visibleA, setVisibleA] = React.useState(true)
    const [visibleB, setVisibleB] = React.useState(false)
    return (
      <>
        <CxDrawer
          id="a"
          onClose={() => {
            onCloseA()
            setVisibleA(false)
          }}
          placement="start"
          visible={visibleA}
        >
          A
        </CxDrawer>
        <CxDrawer id="b" onClose={() => setVisibleB(false)} placement="end" visible={visibleB}>
          B
        </CxDrawer>
        <button type="button" onClick={() => setVisibleB(true)}>
          open b
        </button>
      </>
    )
  }
  const { getByText } = render(<Wrapper />)
  expect(onCloseA).toHaveBeenCalledTimes(0)
  fireEvent.click(getByText('open b'))
  expect(onCloseA).toHaveBeenCalledTimes(1)
  act(() => {
    jest.runAllTimers()
  })
  jest.useRealTimers()
})

test('CxDrawer restores focus to the trigger element after closing', async () => {
  jest.useFakeTimers()
  function Wrapper() {
    const [visible, setVisible] = React.useState(false)
    return (
      <>
        <button type="button" onClick={() => setVisible(true)}>
          open
        </button>
        <CxDrawer onClose={() => setVisible(false)} placement="start" visible={visible}>
          Test
        </CxDrawer>
      </>
    )
  }
  const { getByText } = render(<Wrapper />)
  const trigger = getByText('open')
  trigger.focus()
  expect(document.activeElement).toBe(trigger)

  fireEvent.click(trigger)
  expect(document.activeElement).not.toBe(trigger)

  fireEvent.keyDown(document.activeElement as Element, {
    key: 'Escape',
    code: 'Escape',
    keyCode: 27,
    charCode: 27
  })
  const dialog = document.querySelector('dialog.drawer') as HTMLDialogElement
  fireEvent(dialog, new Event('cancel', { cancelable: true }))
  act(() => {
    jest.runAllTimers()
  })
  expect(document.activeElement).toBe(trigger)
  jest.useRealTimers()
})
