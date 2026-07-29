import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle } from '../../../index'

// The dialog only gets an accessible role="dialog" once open (closed <dialog> elements have no
// exposed role, verified directly), and several tests need the same stable node reference across
// a visible/rerender cycle (e.g. to keep a showModal/close spy attached) — a raw query for the
// element itself, not its accessible role, is the only option throughout this file.
const getDialog = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('dialog') as HTMLDialogElement

describe('CxDrawer', () => {
  describe('rendering', () => {
    test('renders a closed dialog with placement classes', () => {
      const { container } = render(<CxDrawer placement="start">Test</CxDrawer>)
      expect(container).toMatchSnapshot()
      const dialog = getDialog()
      expect(dialog).toHaveClass('drawer', 'drawer-start')
      expect(dialog).not.toHaveAttribute('open')
    })

    test('applies fullscreen, sheet, translucent and responsive classes with className', () => {
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
      const dialog = getDialog()
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
  })

  describe('open/close behavior', () => {
    test('shows via showModal() and locks body scroll, hides and unlocks on close', () => {
      vi.useFakeTimers()
      const { rerender } = render(<CxDrawer placement="start">Test</CxDrawer>)
      const dialog = getDialog()
      const showModalSpy = vi.spyOn(dialog, 'showModal')
      const closeSpy = vi.spyOn(dialog, 'close')

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
        vi.runAllTimers()
      })
      vi.useRealTimers()
    })

    test('with scroll and no backdrop opens non-modally via show()', () => {
      render(
        <CxDrawer backdrop={false} placement="start" scroll visible>
          Test
        </CxDrawer>
      )
      const dialog = getDialog()
      expect(dialog).toHaveClass('nonmodal')
      expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
    })

    test('closes on Escape (modal, native cancel event)', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <CxDrawer onClose={onClose} placement="start" visible>
          Test
        </CxDrawer>
      )
      const dialog = getDialog()
      expect(onClose).toHaveBeenCalledTimes(0)
      fireEvent(dialog, new Event('cancel', { cancelable: true }))
      expect(onClose).toHaveBeenCalledTimes(1)
      act(() => {
        vi.runAllTimers()
      })
      vi.useRealTimers()
    })

    test('closes on Escape (non-modal, keydown fallback)', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <CxDrawer backdrop={false} onClose={onClose} placement="start" scroll visible>
          Test
        </CxDrawer>
      )
      const dialog = getDialog()
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27 })
      expect(onClose).toHaveBeenCalledTimes(1)
      act(() => {
        vi.runAllTimers()
      })
      vi.useRealTimers()
    })

    test('keyboard=false blocks Escape and bounces instead', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const onClosePrevented = vi.fn()
      render(
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
      const dialog = getDialog()
      fireEvent(dialog, new Event('cancel', { cancelable: true }))
      expect(onClosePrevented).toHaveBeenCalledTimes(1)
      expect(dialog).toHaveClass('static')
      act(() => {
        vi.runAllTimers()
      })
      expect(onClose).toHaveBeenCalledTimes(0)
      expect(dialog).not.toHaveClass('static')
      vi.useRealTimers()
    })

    test('closes on backdrop click', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <CxDrawer onClose={onClose} placement="start" visible>
          <div>Content</div>
        </CxDrawer>
      )
      const dialog = getDialog()
      fireEvent.click(screen.getByText('Content'))
      expect(onClose).toHaveBeenCalledTimes(0)
      fireEvent.click(dialog)
      expect(onClose).toHaveBeenCalledTimes(1)
      act(() => {
        vi.runAllTimers()
      })
      vi.useRealTimers()
    })

    test('backdrop="static" bounces instead of closing on backdrop click', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const onClosePrevented = vi.fn()
      render(
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
      const dialog = getDialog()
      fireEvent.click(dialog)
      expect(onClosePrevented).toHaveBeenCalledTimes(1)
      expect(dialog).toHaveClass('static')
      act(() => {
        vi.runAllTimers()
      })
      expect(onClose).toHaveBeenCalledTimes(0)
      vi.useRealTimers()
    })

    test('auto-closes another open drawer', () => {
      vi.useFakeTimers()
      const onCloseA = vi.fn()
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
      render(<Wrapper />)
      expect(onCloseA).toHaveBeenCalledTimes(0)
      fireEvent.click(screen.getByText('open b'))
      expect(onCloseA).toHaveBeenCalledTimes(1)
      act(() => {
        vi.runAllTimers()
      })
      vi.useRealTimers()
    })
  })

  describe('focus management', () => {
    test('restores focus to the trigger element after closing', () => {
      vi.useFakeTimers()
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
      render(<Wrapper />)
      const trigger = screen.getByText('open')
      trigger.focus()
      // document.activeElement is the standard way to read current focus; no Testing Library
      // query surfaces it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(trigger)

      fireEvent.click(trigger)
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).not.toBe(trigger)

      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.keyDown(document.activeElement as Element, {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        charCode: 27
      })
      const dialog = getDialog()
      fireEvent(dialog, new Event('cancel', { cancelable: true }))
      act(() => {
        vi.runAllTimers()
      })
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(trigger)
      vi.useRealTimers()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations when visible', async () => {
      const { container } = render(
        <CxDrawer placement="start" visible>
          <CxDrawerHeader>
            <CxDrawerTitle>Title</CxDrawerTitle>
          </CxDrawerHeader>
          <CxDrawerBody>Body</CxDrawerBody>
        </CxDrawer>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
