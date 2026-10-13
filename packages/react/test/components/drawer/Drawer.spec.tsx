import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  useDrawer
} from '../../../src/index'

// The dialog only gets an accessible role="dialog" once open (closed <dialog> elements have no
// exposed role, verified directly), and several tests need the same stable node reference across
// a visible/rerender cycle (e.g. to keep a showModal/close spy attached) — a raw query for the
// element itself, not its accessible role, is the only option throughout this file.
const getDialog = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('dialog') as HTMLDialogElement

describe('Drawer', () => {
  describe('rendering', () => {
    test('renders a closed dialog with placement classes', () => {
      render(<Drawer placement="start">Test</Drawer>)
      const dialog = getDialog()
      expect(dialog).toHaveClass('drawer', 'drawer-start')
      expect(dialog).not.toHaveAttribute('open')
      expect(dialog).not.toHaveAttribute('aria-labelledby')
    })

    test('applies fullscreen, sheet, translucent and responsive classes with className', () => {
      render(
        <Drawer
          className="bazinga"
          fitContent
          fullscreen
          placement="bottom"
          responsive="lg"
          sheet
          translucent
          visible
        >
          Test
        </Drawer>
      )
      const dialog = getDialog()
      expect(dialog).toHaveClass(
        'bazinga',
        'max-lg:drawer',
        'drawer-bottom',
        'fullscreen',
        'sheet',
        'translucent',
        'drawer-fit-content'
      )
      expect(dialog).not.toHaveClass('drawer')
      expect(dialog).toHaveAttribute('tabindex', '-1')
      expect(dialog).not.toHaveAttribute('aria-labelledby')
    })
  })

  describe('open/close behavior', () => {
    test('rendered with open, stays open instead of closing on mount', () => {
      vi.useFakeTimers()
      const onHidden = vi.fn()
      render(
        <Drawer open onHidden={onHidden} placement="start">
          Test
        </Drawer>
      )
      act(() => vi.runAllTimers())
      expect(getDialog()).toHaveAttribute('open')
      expect(onHidden).not.toHaveBeenCalled()
      vi.useRealTimers()
    })

    test('shows via showModal() and locks body scroll, hides and unlocks on close', () => {
      vi.useFakeTimers()
      const { rerender } = render(<Drawer placement="start">Test</Drawer>)
      const dialog = getDialog()
      const showModalSpy = vi.spyOn(dialog, 'showModal')
      const closeSpy = vi.spyOn(dialog, 'close')

      rerender(
        <Drawer placement="start" visible>
          Test
        </Drawer>
      )
      expect(showModalSpy).toHaveBeenCalledTimes(1)
      expect(document.documentElement).toHaveStyle({ overflow: 'hidden' })

      rerender(
        <Drawer placement="start" visible={false}>
          Test
        </Drawer>
      )
      act(() => {
        vi.runAllTimers()
      })
      expect(closeSpy).toHaveBeenCalledTimes(1)
      expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
      vi.useRealTimers()
    })

    test('with scroll and no backdrop opens non-modally via show()', () => {
      render(
        <Drawer backdrop={false} placement="start" scroll visible>
          Test
        </Drawer>
      )
      const dialog = getDialog()
      expect(dialog).toHaveClass('nonmodal')
      expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
    })

    test('closes on Escape (modal, native cancel event)', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <Drawer onClose={onClose} placement="start" visible>
          Test
        </Drawer>
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
        <Drawer backdrop={false} onClose={onClose} placement="start" scroll visible>
          Test
        </Drawer>
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
        <Drawer
          keyboard={false}
          onClose={onClose}
          onClosePrevented={onClosePrevented}
          placement="start"
          visible
        >
          Test
        </Drawer>
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

    test('non-modal keyboard=false blocks Escape and bounces instead (keydown fallback)', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const onClosePrevented = vi.fn()
      render(
        <Drawer
          backdrop={false}
          keyboard={false}
          onClose={onClose}
          onClosePrevented={onClosePrevented}
          placement="start"
          scroll
          visible
        >
          Test
        </Drawer>
      )
      const dialog = getDialog()
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27 })
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
        <Drawer onClose={onClose} placement="start" visible>
          <div>Content</div>
        </Drawer>
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

    // Regression test: `<dialog>` needs `onClick` for its own backdrop detection, and the props
    // spread put the caller's alongside it — so a caller-supplied `onClick` was silently dropped.
    // It's chained ahead of the backdrop handling now, and fires for every click on the dialog.
    test("runs the caller's own onClick, both inside the drawer and on the backdrop", () => {
      vi.useFakeTimers()
      const onClick = vi.fn()
      const onClose = vi.fn()
      render(
        <Drawer onClick={onClick} onClose={onClose} placement="start" visible>
          <div>Content</div>
        </Drawer>
      )
      const dialog = getDialog()

      fireEvent.click(screen.getByText('Content'))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClose).not.toHaveBeenCalled()

      fireEvent.click(dialog)
      expect(onClick).toHaveBeenCalledTimes(2)
      expect(onClose).toHaveBeenCalledTimes(1)
      act(() => {
        vi.runAllTimers()
      })
      vi.useRealTimers()
    })

    test('a plain button in the footer wired via useDrawer closes the drawer', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const Footer = () => {
        const { close } = useDrawer()
        return (
          <DrawerFooter>
            <button type="button" onClick={close}>
              Cancel
            </button>
          </DrawerFooter>
        )
      }
      render(
        <Drawer onClose={onClose} placement="start" visible>
          <DrawerBody>Content</DrawerBody>
          <Footer />
        </Drawer>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
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
        <Drawer
          backdrop="static"
          onClose={onClose}
          onClosePrevented={onClosePrevented}
          placement="start"
          visible
        >
          Test
        </Drawer>
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
            <Drawer
              id="a"
              onClose={() => {
                onCloseA()
                setVisibleA(false)
              }}
              placement="start"
              visible={visibleA}
            >
              A
            </Drawer>
            <Drawer id="b" onClose={() => setVisibleB(false)} placement="end" visible={visibleB}>
              B
            </Drawer>
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

    test('an uncontrolled drawer closes itself when another drawer opens', () => {
      vi.useFakeTimers()
      function Wrapper() {
        const [visibleB, setVisibleB] = React.useState(false)
        return (
          <>
            <Drawer aria-label="A" defaultVisible placement="start">
              A
            </Drawer>
            <Drawer aria-label="B" placement="end" visible={visibleB}>
              B
            </Drawer>
            <button type="button" onClick={() => setVisibleB(true)}>
              open b
            </button>
          </>
        )
      }
      render(<Wrapper />)
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.getByRole('dialog', { name: 'A' })).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: 'open b', hidden: true }))
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.queryByRole('dialog', { name: 'A' })).not.toBeInTheDocument()
      expect(screen.getByRole('dialog', { name: 'B' })).toBeInTheDocument()
      vi.useRealTimers()
    })
    // Regression test: the show effect returned early for a dialog that was still open, so the
    // pending end of the exit closed a drawer whose `visible` was `true` again.
    test('reopened while its exit runs, it stays open', () => {
      vi.useFakeTimers()
      const onHidden = vi.fn()
      const { rerender } = render(
        <Drawer onHidden={onHidden} placement="start" visible>
          Test
        </Drawer>
      )
      act(() => vi.runAllTimers())
      const dialog = getDialog()

      rerender(
        <Drawer onHidden={onHidden} placement="start" visible={false}>
          Test
        </Drawer>
      )
      expect(dialog).toHaveClass('hiding')
      rerender(
        <Drawer onHidden={onHidden} placement="start" visible>
          Test
        </Drawer>
      )
      act(() => vi.runAllTimers())

      expect(dialog).toHaveAttribute('open')
      expect(dialog).not.toHaveClass('hiding')
      expect(onHidden).not.toHaveBeenCalled()
      expect(document.documentElement).toHaveStyle({ overflow: 'hidden' })
      vi.useRealTimers()
    })

    // Regression test: nothing listened for the native `close` event (a second Escape in a row,
    // whose `cancel` a page can't prevent), so the drawer stayed `visible` and scroll-locked.
    test('follows a close the browser makes by itself', () => {
      const onClose = vi.fn()
      const onHidden = vi.fn()
      render(
        <Drawer defaultVisible onClose={onClose} onHidden={onHidden} placement="start">
          Test
        </Drawer>
      )
      const dialog = getDialog()
      expect(document.documentElement).toHaveStyle({ overflow: 'hidden' })
      act(() => {
        dialog.open = false
        dialog.dispatchEvent(new Event('close'))
      })
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(onHidden).toHaveBeenCalledTimes(1)
      expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
    })

    // Regression tests: a `responsive` drawer opened below its breakpoint stayed in the top
    // layer, over a scroll-locked page, once the viewport had grown past the breakpoint, where
    // chassis-css lays it out in the page. jsdom applies no stylesheet: `position` stands in for
    // what chassis-css computes on each side of the breakpoint.
    describe('responsive', () => {
      const resizeTo = (dialog: HTMLDialogElement, position: 'fixed' | 'static') => {
        dialog.style.position = position
        fireEvent(window, new Event('resize'))
      }

      test('asks to close when the viewport grows past the breakpoint', () => {
        const onClose = vi.fn()
        render(
          <Drawer onClose={onClose} placement="start" responsive="lg" visible>
            Test
          </Drawer>
        )
        const dialog = getDialog()
        resizeTo(dialog, 'fixed')
        expect(onClose).not.toHaveBeenCalled()
        resizeTo(dialog, 'static')
        expect(onClose).toHaveBeenCalledTimes(1)
      })

      test('an uncontrolled one closes itself and unlocks the page', () => {
        vi.useFakeTimers()
        render(
          <Drawer defaultVisible placement="start" responsive="lg">
            Test
          </Drawer>
        )
        const dialog = getDialog()
        dialog.style.position = 'fixed'
        expect(document.documentElement).toHaveStyle({ overflow: 'hidden' })
        resizeTo(dialog, 'static')
        act(() => vi.runAllTimers())
        expect(dialog).not.toHaveAttribute('open')
        expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
        vi.useRealTimers()
      })

      test('leaves a closed drawer, and one that is not responsive, alone', () => {
        const onClose = vi.fn()
        const { rerender } = render(
          <Drawer onClose={onClose} placement="start" responsive="lg">
            Test
          </Drawer>
        )
        resizeTo(getDialog(), 'static')
        rerender(
          <Drawer onClose={onClose} placement="start" visible>
            Test
          </Drawer>
        )
        resizeTo(getDialog(), 'static')
        expect(onClose).not.toHaveBeenCalled()
      })
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
            <Drawer onClose={() => setVisible(false)} placement="start" visible={visible}>
              Test
            </Drawer>
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
        <Drawer placement="start" visible>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>Body</DrawerBody>
        </Drawer>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has a resolvable accessible name from DrawerTitle via automatic aria-labelledby wiring', () => {
      render(
        <Drawer placement="start" visible>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>Body</DrawerBody>
        </Drawer>
      )
      const dialog = getDialog()
      expect(dialog).toHaveAccessibleName('Filters')
    })

    // Regression tests: `aria-labelledby` always named the generated id, which no element has
    // when there is no `DrawerTitle` or the title has an id of its own.
    test('a caller-supplied DrawerTitle id still names the drawer', () => {
      render(
        <Drawer placement="start" visible>
          <DrawerHeader>
            <DrawerTitle id="custom-title">Filters</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>Body</DrawerBody>
        </Drawer>
      )
      expect(screen.getByText('Filters')).toHaveAttribute('id', 'custom-title')
      expect(getDialog()).toHaveAttribute('aria-labelledby', 'custom-title')
      expect(getDialog()).toHaveAccessibleName('Filters')
    })

    test('has no aria-labelledby without a DrawerTitle, and loses it with the title', () => {
      const { rerender } = render(
        <Drawer aria-label="Filters" placement="start" visible>
          <DrawerBody>Body</DrawerBody>
        </Drawer>
      )
      const dialog = getDialog()
      expect(dialog).not.toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAccessibleName('Filters')

      rerender(
        <Drawer placement="start" visible>
          <DrawerTitle>Sort</DrawerTitle>
          <DrawerBody>Body</DrawerBody>
        </Drawer>
      )
      expect(dialog).toHaveAccessibleName('Sort')

      rerender(
        <Drawer placement="start" visible>
          <DrawerBody>Body</DrawerBody>
        </Drawer>
      )
      expect(dialog).not.toHaveAttribute('aria-labelledby')
    })

    test("a caller's aria-label names the drawer, over its title", () => {
      render(
        <Drawer aria-label="Filters" placement="start" visible>
          <DrawerTitle>Sort</DrawerTitle>
          <DrawerBody>Body</DrawerBody>
        </Drawer>
      )
      expect(getDialog()).not.toHaveAttribute('aria-labelledby')
      expect(getDialog()).toHaveAccessibleName('Filters')
    })
  })
})
