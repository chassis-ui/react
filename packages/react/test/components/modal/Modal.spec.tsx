import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  useModal
} from '../../../src/index'

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
        <Modal className="bazinga" fullscreen="xlarge" scrollable size="xlarge" visible>
          Test
        </Modal>
      )
      const dialog = getDialog()
      expect(dialog).toHaveClass('bazinga', 'xlarge', 'scrollable', 'max-xlarge:fullscreen')
      expect(dialog).not.toHaveClass('modal-xlarge', 'modal-dialog-scrollable', 'modal-fullscreen')
      expect(dialog).toHaveAttribute('tabindex', '-1')
      expect(dialog).toHaveAttribute('open', '')
    })
  })

  describe('open/close behavior', () => {
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
  })

  describe('accessibility', () => {
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

    test('a caller-supplied ModalTitle id opts out of the generated one', () => {
      render(
        <Modal visible>
          <ModalHeader>
            <ModalTitle id="custom-title">Delete item</ModalTitle>
          </ModalHeader>
          <ModalBody>Body</ModalBody>
        </Modal>
      )
      expect(screen.getByText('Delete item')).toHaveAttribute('id', 'custom-title')
    })
  })
})
