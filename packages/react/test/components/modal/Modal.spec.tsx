import * as React from 'react'
import { flushSync } from 'react-dom'
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react'
// Aliased: testing-library's lint rules treat any `render*` call's result as a `render()` result.
import { renderToString as toHtml } from 'react-dom/server'
import { axe } from 'jest-axe'

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  useModal
} from '../../../src/index'
import { queueDialogCloseEvents } from '../../queuedDialogClose'
import { danglingReferences } from '../../utils/danglingReferences'

// The dialog only gets an accessible role="dialog" once open (closed <dialog> elements have no
// exposed role, verified directly), and several tests need the same stable node reference across
// a visible/rerender cycle (e.g. to keep a showModal/close spy attached) — a raw query for the
// element itself, not its accessible role, is the only option throughout this file.
const getDialog = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('dialog') as HTMLDialogElement

describe('Modal', () => {
  describe('rendering', () => {
    test('renders a closed dialog with the base classes', () => {
      render(<Modal>Test</Modal>)
      const dialog = getDialog()
      expect(dialog).toHaveClass('modal', 'dialog')
      expect(dialog).not.toHaveAttribute('open')
    })

    test('applies size, fullscreen and scrollable classes with className', () => {
      render(
        <Modal className="bazinga" fullscreen="xl" scrollable size="xl" visible>
          Test
        </Modal>
      )
      const dialog = getDialog()
      expect(dialog).toHaveClass('bazinga', 'xl', 'scrollable', 'max-xl:fullscreen')
      expect(dialog).not.toHaveClass('modal-xl', 'modal-dialog-scrollable', 'modal-fullscreen')
      expect(dialog).toHaveAttribute('tabindex', '-1')
      expect(dialog).toHaveAttribute('open', '')
    })
  })

  describe('open/close behavior', () => {
    // The native `open` attribute, as a static preview uses it: rendered open from the first
    // paint, it stays open instead of being closed on mount.
    test('rendered with open, stays open, non-modal, until a close request', () => {
      vi.useFakeTimers()
      const onHidden = vi.fn()
      render(
        <Modal open onHidden={onHidden}>
          Test
        </Modal>
      )
      act(() => vi.runAllTimers())
      const dialog = getDialog()
      expect(dialog).toHaveAttribute('open')
      expect(dialog).not.toHaveClass('hiding')
      expect(onHidden).not.toHaveBeenCalled()

      fireEvent.keyDown(dialog, { key: 'Escape' })
      act(() => vi.runAllTimers())
      expect(dialog).not.toHaveAttribute('open')
      expect(onHidden).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    test('shows via showModal() and locks body scroll, hides and unlocks on close', () => {
      vi.useFakeTimers()
      const { rerender } = render(<Modal>Test</Modal>)
      const dialog = getDialog()
      const showModalSpy = vi.spyOn(dialog, 'showModal')
      const closeSpy = vi.spyOn(dialog, 'close')

      rerender(<Modal visible>Test</Modal>)
      expect(showModalSpy).toHaveBeenCalledTimes(1)
      expect(document.documentElement).toHaveStyle({ overflow: 'hidden' })

      rerender(<Modal visible={false}>Test</Modal>)
      act(() => {
        vi.runAllTimers()
      })
      expect(closeSpy).toHaveBeenCalledTimes(1)
      expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
      vi.useRealTimers()
    })

    test('closes on Escape (modal, native cancel event)', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <Modal onClose={onClose} visible>
          Test
        </Modal>
      )
      const dialog = getDialog()
      expect(onClose).toHaveBeenCalledTimes(0)
      fireEvent(dialog, new Event('cancel', { cancelable: true }))
      act(() => {
        vi.runAllTimers()
      })
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    test('closes on Escape (non-modal, keydown fallback)', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <Modal modal={false} onClose={onClose} visible>
          Test
        </Modal>
      )
      const dialog = getDialog()
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27 })
      act(() => {
        vi.runAllTimers()
      })
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    test('keyboard=false blocks Escape and bounces instead', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const onClosePrevented = vi.fn()
      render(
        <Modal keyboard={false} onClose={onClose} onClosePrevented={onClosePrevented} visible>
          Test
        </Modal>
      )
      const dialog = getDialog()
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

    test('modal={false} keyboard=false blocks Escape and bounces instead (keydown fallback)', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const onClosePrevented = vi.fn()
      render(
        <Modal
          keyboard={false}
          modal={false}
          onClose={onClose}
          onClosePrevented={onClosePrevented}
          visible
        >
          Test
        </Modal>
      )
      const dialog = getDialog()
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27 })
      expect(onClosePrevented).toHaveBeenCalledTimes(1)
      expect(dialog).toHaveClass('dialog-static')
      act(() => {
        vi.runAllTimers()
      })
      expect(onClose).toHaveBeenCalledTimes(0)
      expect(dialog).not.toHaveClass('dialog-static')
      vi.useRealTimers()
    })

    test('closes on backdrop click', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <Modal onClose={onClose} visible>
          <div>Content</div>
        </Modal>
      )
      const dialog = getDialog()
      fireEvent.click(screen.getByText('Content'))
      expect(onClose).toHaveBeenCalledTimes(0)
      fireEvent.click(dialog)
      act(() => {
        vi.runAllTimers()
      })
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    // Regression test: `<dialog>` needs `onClick` for its own backdrop detection, and the props
    // spread put the caller's alongside it — so a caller-supplied `onClick` was silently dropped.
    // It's chained ahead of the backdrop handling now, and fires for every click on the dialog.
    test("runs the caller's own onClick, both inside the dialog and on the backdrop", () => {
      vi.useFakeTimers()
      const onClick = vi.fn()
      const onClose = vi.fn()
      render(
        <Modal onClick={onClick} onClose={onClose} visible>
          <div>Content</div>
        </Modal>
      )
      const dialog = getDialog()

      fireEvent.click(screen.getByText('Content'))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClose).not.toHaveBeenCalled()

      fireEvent.click(dialog)
      act(() => {
        vi.runAllTimers()
      })
      expect(onClick).toHaveBeenCalledTimes(2)
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    test('backdrop={false} still closes on backdrop click, same as the default — only "static" bounces', () => {
      // Intentional: chassis-css's vanilla Dialog only reads `backdrop` to distinguish 'static'
      // from everything else; `modal` alone decides showModal()/show(). Unlike Drawer (whose own
      // vanilla counterpart derives modality from backdrop), Modal's backdrop={false} is not a
      // "go non-modal" shorthand — see the backdrop prop's own doc comment in Modal.tsx.
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <Modal backdrop={false} onClose={onClose} visible>
          Test
        </Modal>
      )
      const dialog = getDialog()
      fireEvent.click(dialog)
      act(() => {
        vi.runAllTimers()
      })
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    test('backdrop="static" bounces instead of closing on backdrop click', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const onClosePrevented = vi.fn()
      render(
        <Modal backdrop="static" onClose={onClose} onClosePrevented={onClosePrevented} visible>
          Test
        </Modal>
      )
      const dialog = getDialog()
      fireEvent.click(dialog)
      expect(onClosePrevented).toHaveBeenCalledTimes(1)
      expect(dialog).toHaveClass('dialog-static')
      act(() => {
        vi.runAllTimers()
      })
      expect(onClose).toHaveBeenCalledTimes(0)
      vi.useRealTimers()
    })

    test('a plain button in the footer wired via useModal closes the modal', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const Footer = () => {
        const { close } = useModal()
        return (
          <ModalFooter>
            <button type="button" onClick={close}>
              Cancel
            </button>
          </ModalFooter>
        )
      }
      render(
        <Modal onClose={onClose} visible>
          <ModalBody>Content</ModalBody>
          <Footer />
        </Modal>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      act(() => {
        vi.runAllTimers()
      })
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })
    // The browser closing the dialog by itself, as jsdom never does: a second Escape in a row
    // (its `cancel` can't be prevented), a `<form method="dialog">`, a caller's own `close()`.
    const closeNatively = (dialog: HTMLDialogElement) =>
      act(() => {
        dialog.open = false
        dialog.dispatchEvent(new Event('close'))
      })

    // Regression tests (#65): a browser fires `close` from a queued task. A modal shown again in
    // the same task as its close took that event for the browser's own close and closed again.
    describe('with the close event queued, as browsers fire it', () => {
      let restore: () => void
      beforeEach(() => {
        vi.useFakeTimers()
        restore = queueDialogCloseEvents()
      })
      afterEach(() => {
        restore()
        vi.useRealTimers()
      })

      test('a modal reopened from onHidden stays open, with no close request', () => {
        const onClose = vi.fn()
        const onVisibleChange = vi.fn()
        function Wizard() {
          const [step, setStep] = React.useState<0 | 1 | 2>(1)
          return (
            <>
              <button onClick={() => setStep(0)} type="button">
                Finish step
              </button>
              <Modal
                aria-label="Wizard"
                instant
                onClose={onClose}
                onHidden={() => setStep((current) => (current === 0 ? 2 : current))}
                onVisibleChange={(next) => {
                  onVisibleChange(next)
                  if (!next) setStep(0)
                }}
                visible={step !== 0}
              >
                Step {step}
              </Modal>
            </>
          )
        }
        render(<Wizard />)
        const dialog = getDialog()
        fireEvent.click(screen.getByRole('button', { name: 'Finish step', hidden: true }))
        expect(dialog).toHaveAttribute('open')
        expect(screen.getByText('Step 2')).toBeInTheDocument()

        // The close event of step 1 arrives.
        act(() => vi.runAllTimers())
        expect(dialog).toHaveAttribute('open')
        expect(onClose).not.toHaveBeenCalled()
        expect(onVisibleChange).not.toHaveBeenCalled()
        expect(document.documentElement).toHaveStyle({ overflow: 'hidden' })
      })

      test('a modal set to visible={false} and back in one event stays open', () => {
        const onClose = vi.fn()
        const onHidden = vi.fn()
        function Toggle() {
          const [visible, setVisible] = React.useState(true)
          return (
            <>
              <button
                onClick={() => {
                  // Committed at once, so the modal closes and calls `close()` in this event.
                  flushSync(() => setVisible(false))
                  setVisible(true)
                }}
                type="button"
              >
                Restart
              </button>
              <Modal
                aria-label="Restartable"
                instant
                onClose={onClose}
                onHidden={onHidden}
                visible={visible}
              >
                Content
              </Modal>
            </>
          )
        }
        render(<Toggle />)
        const dialog = getDialog()
        fireEvent.click(screen.getByRole('button', { name: 'Restart', hidden: true }))
        expect(onHidden).toHaveBeenCalledTimes(1)
        expect(dialog).toHaveAttribute('open')

        // The close event of the first close arrives.
        act(() => vi.runAllTimers())
        expect(dialog).toHaveAttribute('open')
        expect(onClose).not.toHaveBeenCalled()
      })

      test("the browser's own close still closes it, when nothing reopened it", () => {
        const onClose = vi.fn()
        const onHidden = vi.fn()
        render(
          <Modal aria-label="Closable" defaultVisible instant onClose={onClose} onHidden={onHidden}>
            Content
          </Modal>
        )
        const dialog = getDialog()
        // A caller's own `close()`, as a `<form method="dialog">` or a second Escape would.
        act(() => dialog.close())
        act(() => vi.runAllTimers())
        expect(dialog).not.toHaveAttribute('open')
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onHidden).toHaveBeenCalledTimes(1)
        expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
      })
    })

    // Regression test: the show effect returned early for a dialog that was still open, so the
    // pending end of the exit closed a modal whose `visible` was `true` again.
    test('reopened while its exit runs, it stays open', () => {
      vi.useFakeTimers()
      const onHidden = vi.fn()
      const onShown = vi.fn()
      const props = { onHidden, onShown }
      const { rerender } = render(
        <Modal {...props} visible>
          Test
        </Modal>
      )
      act(() => vi.runAllTimers())
      const dialog = getDialog()
      expect(onShown).toHaveBeenCalledTimes(1)

      rerender(
        <Modal {...props} visible={false}>
          Test
        </Modal>
      )
      expect(dialog).toHaveClass('hiding')
      rerender(
        <Modal {...props} visible>
          Test
        </Modal>
      )
      expect(dialog).not.toHaveClass('hiding')
      act(() => vi.runAllTimers())

      expect(dialog).toHaveAttribute('open')
      expect(onHidden).not.toHaveBeenCalled()
      expect(onShown).toHaveBeenCalledTimes(2)
      expect(document.documentElement).toHaveStyle({ overflow: 'hidden' })

      // And it still closes when asked to.
      rerender(
        <Modal {...props} visible={false}>
          Test
        </Modal>
      )
      act(() => vi.runAllTimers())
      expect(dialog).not.toHaveAttribute('open')
      expect(onHidden).toHaveBeenCalledTimes(1)
      expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })
      vi.useRealTimers()
    })

    // Regression test: only `onVisibleChange` was guarded, so every Escape or backdrop click
    // during the exit fired `onClose` again.
    test('close requests repeated during the exit fire onClose once', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const onVisibleChange = vi.fn()
      render(
        <Modal defaultVisible onClose={onClose} onVisibleChange={onVisibleChange}>
          Test
        </Modal>
      )
      const dialog = getDialog()
      fireEvent(dialog, new Event('cancel', { cancelable: true }))
      expect(dialog).toHaveClass('hiding')
      fireEvent(dialog, new Event('cancel', { cancelable: true }))
      fireEvent.click(dialog)
      act(() => vi.runAllTimers())
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(onVisibleChange).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    // Regression test: nothing listened for the native `close` event, so a modal the browser
    // closed stayed `visible`, with the page scroll-locked and `onHidden` never fired.
    test('follows a close the browser makes by itself', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const onHidden = vi.fn()
      const onVisibleChange = vi.fn()
      const Example = () => {
        const [visible, setVisible] = React.useState(true)
        return (
          <>
            <button type="button" onClick={() => setVisible(true)}>
              Open
            </button>
            <Modal
              onClose={onClose}
              onHidden={onHidden}
              onVisibleChange={(next) => {
                onVisibleChange(next)
                setVisible(next)
              }}
              visible={visible}
            >
              Test
            </Modal>
          </>
        )
      }
      render(<Example />)
      const dialog = getDialog()
      const showModalSpy = vi.spyOn(dialog, 'showModal')
      expect(document.documentElement).toHaveStyle({ overflow: 'hidden' })

      closeNatively(dialog)
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(onVisibleChange).toHaveBeenCalledExactlyOnceWith(false)
      expect(onHidden).toHaveBeenCalledTimes(1)
      expect(dialog).not.toHaveClass('hiding')
      expect(document.documentElement).not.toHaveStyle({ overflow: 'hidden' })

      // The state followed, so the modal opens again.
      fireEvent.click(screen.getByRole('button', { name: 'Open' }))
      expect(showModalSpy).toHaveBeenCalledTimes(1)
      expect(dialog).toHaveAttribute('open')
      vi.useRealTimers()
    })

    test("the close event of the modal's own close() is not a second close", () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const onHidden = vi.fn()
      const { rerender } = render(
        <Modal onClose={onClose} onHidden={onHidden} visible>
          Test
        </Modal>
      )
      rerender(
        <Modal onClose={onClose} onHidden={onHidden} visible={false}>
          Test
        </Modal>
      )
      act(() => vi.runAllTimers())
      expect(onClose).not.toHaveBeenCalled()
      expect(onHidden).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    // Regression test: StrictMode runs the show effect twice on mount. The cleanup between the
    // two dropped the wait for the enter transition, and the second run found the dialog open.
    test('fires onShow and onShown once under StrictMode, mounted visible', () => {
      vi.useFakeTimers()
      const onShow = vi.fn()
      const onShown = vi.fn()
      render(
        <React.StrictMode>
          <Modal onShow={onShow} onShown={onShown} visible>
            Test
          </Modal>
        </React.StrictMode>
      )
      act(() => vi.runAllTimers())
      expect(onShow).toHaveBeenCalledTimes(1)
      expect(onShown).toHaveBeenCalledTimes(1)
      expect(getDialog()).toHaveAttribute('open')
      vi.useRealTimers()
    })

    test("runs the caller's own onKeyDown ahead of the Escape handling", () => {
      const onClose = vi.fn()
      const onKeyDown = vi.fn()
      render(
        <Modal instant modal={false} onClose={onClose} onKeyDown={onKeyDown} visible>
          Test
        </Modal>
      )
      fireEvent.keyDown(getDialog(), { key: 'Escape' })
      expect(onKeyDown).toHaveBeenCalledTimes(1)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('focus management', () => {
    // React writes no `autofocus` attribute in a client render: it calls `focus()` on mount, which
    // a closed dialog ignores. `data-autofocus` is what the dialog can find when it opens.
    test('focuses the element with data-autofocus when it opens', () => {
      const Probe = ({ visible }: { visible: boolean }) => (
        <Modal instant visible={visible}>
          <ModalTitle>Title</ModalTitle>
          <ModalBody>
            <button type="button">First</button>
            <button data-autofocus="" type="button">
              Second
            </button>
          </ModalBody>
        </Modal>
      )
      const { rerender } = render(<Probe visible={false} />)
      rerender(<Probe visible />)
      expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus()
    })

    test('restores focus to the trigger element after closing', () => {
      vi.useFakeTimers()
      function Wrapper() {
        const [visible, setVisible] = React.useState(false)
        return (
          <>
            <button type="button" onClick={() => setVisible(true)}>
              open
            </button>
            <Modal onClose={() => setVisible(false)} visible={visible}>
              Test
            </Modal>
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

      const dialog = getDialog()
      fireEvent(dialog, new Event('cancel', { cancelable: true }))
      act(() => {
        vi.runAllTimers()
      })
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(trigger)
      vi.useRealTimers()
    })

    // Regression test: a modal taken out of the tree while open (`{open && <Modal visible>}`)
    // never reached the end of its exit, which is where focus went back, so it fell to `<body>`.
    test('restores focus to the trigger when unmounted while open', async () => {
      function Wrapper() {
        const [open, setOpen] = React.useState(false)
        return (
          <>
            <button type="button" onClick={() => setOpen(true)}>
              open
            </button>
            {open && (
              <Modal visible>
                <button type="button" onClick={() => setOpen(false)}>
                  remove
                </button>
              </Modal>
            )}
          </>
        )
      }
      render(<Wrapper />)
      const trigger = screen.getByRole('button', { name: 'open' })
      trigger.focus()
      fireEvent.click(trigger)
      expect(getDialog()).toHaveFocus()

      fireEvent.click(screen.getByRole('button', { name: 'remove' }))
      // Focus goes back a microtask after the unmount.
      await waitFor(() => expect(trigger).toHaveFocus())
    })

    // StrictMode unmounts and mounts again on the first commit: that must not close the dialog
    // or move focus out of it.
    test('keeps focus in a modal mounted visible under StrictMode', async () => {
      render(
        <React.StrictMode>
          <Modal visible>
            <button type="button">inside</button>
          </Modal>
        </React.StrictMode>
      )
      // Past the microtask an unmount would have restored focus in.
      await act(() => Promise.resolve())
      expect(getDialog()).toHaveAttribute('open')
      expect(getDialog()).toHaveFocus()
    })
  })

  // Regression tests (#67): before hydration the dialog was labelled by the generated title id
  // whether or not a title rendered, and whatever id that title had.
  describe('server HTML', () => {
    const labelledBy = (html: string) => /<dialog[^>]*aria-labelledby="([^"]*)"/.exec(html)?.[1]

    test('a modal rendered open is labelled by the id its title renders', () => {
      const html = toHtml(
        <Modal open>
          <ModalHeader>
            <ModalTitle>Title</ModalTitle>
          </ModalHeader>
        </Modal>
      )
      expect(labelledBy(html)).toBe(/<h2[^>]*id="([^"]*)"/.exec(html)?.[1])
      expect(danglingReferences(html)).toEqual([])
    })

    test("its title's own id, the asChild element's id, or none for an empty id", () => {
      expect(
        labelledBy(
          toHtml(
            <Modal open>
              <ModalTitle id="own">Title</ModalTitle>
            </Modal>
          )
        )
      ).toBe('own')
      expect(
        labelledBy(
          toHtml(
            <Modal open>
              <ModalTitle asChild id="ignored">
                <h3 id="slotted">Title</h3>
              </ModalTitle>
            </Modal>
          )
        )
      ).toBe('slotted')
      expect(
        labelledBy(
          toHtml(
            <Modal open>
              <ModalTitle id="">Title</ModalTitle>
            </Modal>
          )
        )
      ).toBeUndefined()
    })

    test('a title passed through a component of the caller is found', () => {
      const Section = ({ children }: { children: React.ReactNode }) => <section>{children}</section>
      const html = toHtml(
        <Modal open>
          <Section>
            <>
              {[
                <ModalTitle id="deep" key="title">
                  Title
                </ModalTitle>
              ]}
            </>
          </Section>
        </Modal>
      )
      expect(labelledBy(html)).toBe('deep')
    })

    test('no aria-labelledby with no title, nor for the title of a modal nested in it', () => {
      const html = toHtml(
        <Modal open>
          <ModalBody>
            <Modal>
              <ModalTitle id="inner">Inner</ModalTitle>
            </Modal>
          </ModalBody>
        </Modal>
      )
      expect(/^<dialog[^>]*>/.exec(html)?.[0]).not.toContain('aria-labelledby')
      expect(danglingReferences(html)).toEqual([])
    })

    test('a closed modal has no aria-labelledby until it hydrates', () => {
      const html = toHtml(
        <Modal>
          <ModalTitle>Title</ModalTitle>
        </Modal>
      )
      expect(labelledBy(html)).toBeUndefined()
    })
  })

  describe('accessibility', () => {
    // Regression test (#66): `aria-labelledby={undefined}` from a wrapper that forwards an
    // optional prop wrote over the title's label, leaving the dialog with no name.
    test("an aria-labelledby passed as undefined leaves the title's label in place", () => {
      const Wrapper = ({ labelId }: { labelId?: string }) => (
        <Modal aria-labelledby={labelId} instant visible>
          <ModalTitle>Delete item</ModalTitle>
        </Modal>
      )
      render(<Wrapper />)
      expect(screen.getByRole('dialog', { name: 'Delete item' })).toBeInTheDocument()
    })

    test("a caller's own aria-labelledby still names the dialog", () => {
      render(
        <>
          <span id="external-label">External</span>
          <Modal aria-labelledby="external-label" instant visible>
            <ModalTitle>Delete item</ModalTitle>
          </Modal>
        </>
      )
      expect(screen.getByRole('dialog', { name: 'External' })).toBeInTheDocument()
    })

    test('has no axe violations when visible', async () => {
      const { container } = render(
        <Modal visible>
          <ModalHeader>
            <ModalTitle>Title</ModalTitle>
          </ModalHeader>
          <ModalBody>Body</ModalBody>
        </Modal>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has a resolvable accessible name from ModalTitle via automatic aria-labelledby wiring', () => {
      render(
        <Modal visible>
          <ModalHeader>
            <ModalTitle>Delete item</ModalTitle>
          </ModalHeader>
          <ModalBody>Body</ModalBody>
        </Modal>
      )
      const dialog = getDialog()
      expect(dialog).toHaveAccessibleName('Delete item')
    })

    // Regression tests: `aria-labelledby` always named the generated id, which no element has
    // when there is no `ModalTitle` or the title has an id of its own.
    // Regression test: under `asChild` the child's own id is the one rendered, and the modal's
    // `aria-labelledby` named the id the title had asked for, which no element had.
    test('an asChild ModalTitle whose child has an id still names the modal', () => {
      render(
        <Modal visible>
          <ModalHeader>
            <ModalTitle asChild>
              <h3 id="child-title">Delete item</h3>
            </ModalTitle>
          </ModalHeader>
        </Modal>
      )
      expect(getDialog()).toHaveAttribute('aria-labelledby', 'child-title')
      expect(getDialog()).toHaveAccessibleName('Delete item')
    })

    test('a caller-supplied ModalTitle id still names the modal', () => {
      render(
        <Modal visible>
          <ModalHeader>
            <ModalTitle id="custom-title">Delete item</ModalTitle>
          </ModalHeader>
          <ModalBody>Body</ModalBody>
        </Modal>
      )
      expect(screen.getByText('Delete item')).toHaveAttribute('id', 'custom-title')
      expect(getDialog()).toHaveAttribute('aria-labelledby', 'custom-title')
      expect(getDialog()).toHaveAccessibleName('Delete item')
    })

    test('has no aria-labelledby without a ModalTitle, and loses it with the title', () => {
      const { rerender } = render(
        <Modal aria-label="Settings" visible>
          <ModalBody>Body</ModalBody>
        </Modal>
      )
      const dialog = getDialog()
      expect(dialog).not.toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAccessibleName('Settings')

      rerender(
        <Modal visible>
          <ModalTitle>Delete item</ModalTitle>
          <ModalBody>Body</ModalBody>
        </Modal>
      )
      expect(dialog).toHaveAccessibleName('Delete item')

      rerender(
        <Modal visible>
          <ModalBody>Body</ModalBody>
        </Modal>
      )
      expect(dialog).not.toHaveAttribute('aria-labelledby')
    })

    test("a caller's aria-label names the modal, over its title", () => {
      render(
        <Modal aria-label="Settings" visible>
          <ModalTitle>Delete item</ModalTitle>
          <ModalBody>Body</ModalBody>
        </Modal>
      )
      expect(getDialog()).not.toHaveAttribute('aria-labelledby')
      expect(getDialog()).toHaveAccessibleName('Settings')
    })

    test("a caller's aria-labelledby replaces the title's", () => {
      render(
        <>
          <span id="elsewhere">Elsewhere</span>
          <Modal aria-labelledby="elsewhere" visible>
            <ModalTitle>Delete item</ModalTitle>
            <ModalBody>Body</ModalBody>
          </Modal>
        </>
      )
      expect(getDialog()).toHaveAccessibleName('Elsewhere')
    })
  })
})
