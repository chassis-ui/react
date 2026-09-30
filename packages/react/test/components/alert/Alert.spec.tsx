import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
// Aliased: testing-library's lint rules treat any `render*` call's result as a `render()` result.
import { renderToString as toHtml } from 'react-dom/server'
import { axe } from 'jest-axe'

import {
  Alert,
  AlertBody,
  AlertCancel,
  AlertCode,
  AlertFooter,
  AlertIcon,
  AlertProps,
  AlertText,
  AlertTitle,
  Button,
  Modal,
  ModalBody,
  ModalTitle
} from '../../../src/index'

// A closed <dialog> exposes no role, and several tests need the element before it opens or keep
// the same node across a rerender; a query for the element itself is the only option.
const getDialog = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('dialog') as HTMLDialogElement

const cancel = () => fireEvent(getDialog(), new Event('cancel', { cancelable: true }))

const ConfirmDelete = ({ withCode = false, ...props }: AlertProps & { withCode?: boolean }) => (
  <Alert instant {...props}>
    <AlertIcon name="exclamation-triangle-solid" color="danger" />
    <AlertBody>
      <AlertTitle>Delete the file?</AlertTitle>
      {withCode && <AlertCode>ERR-1234</AlertCode>}
      <AlertText>This can't be undone.</AlertText>
    </AlertBody>
    <AlertFooter>
      <Button color="danger">Delete</Button>
      <AlertCancel>Cancel</AlertCancel>
    </AlertFooter>
  </Alert>
)

describe('Alert', () => {
  describe('rendering', () => {
    test('renders a closed alert dialog with chassis-css classes', () => {
      render(<ConfirmDelete />)
      const dialog = getDialog()
      expect(dialog).toHaveClass('alert', 'dialog')
      expect(dialog).toHaveAttribute('role', 'alertdialog')
      expect(dialog).not.toHaveAttribute('open')
    })

    test('opens as a modal dialog, named by its title and described by its text', () => {
      render(<ConfirmDelete visible />)
      expect(
        screen.getByRole('alertdialog', {
          name: 'Delete the file?',
          description: "This can't be undone."
        })
      ).toHaveAttribute('open')
    })

    test('is described by its code, then its text', () => {
      render(<ConfirmDelete visible withCode />)
      expect(
        screen.getByRole('alertdialog', { description: "ERR-1234 This can't be undone." })
      ).toBeInTheDocument()
    })

    test('a caller aria-describedby replaces the one it builds', () => {
      render(
        <>
          <p id="elsewhere">Described elsewhere</p>
          <ConfirmDelete aria-describedby="elsewhere" visible />
        </>
      )
      expect(
        screen.getByRole('alertdialog', { description: 'Described elsewhere' })
      ).toBeInTheDocument()
    })

    test('the server HTML names no title or description, so no id that is not there', () => {
      const html = toHtml(<ConfirmDelete withCode />)
      expect(html).toContain('role="alertdialog"')
      expect(html).not.toContain('aria-describedby')
      expect(html).not.toContain('aria-labelledby')
    })

    test('an empty aria-describedby counts as unset', () => {
      render(<ConfirmDelete aria-describedby="" visible />)
      expect(
        screen.getByRole('alertdialog', { description: "This can't be undone." })
      ).toBeInTheDocument()
    })

    test('names and describes itself by the ids that reach the DOM: a caller id, asChild', () => {
      render(
        <Alert visible>
          <AlertTitle asChild>
            <h3 id="own-title">Own title</h3>
          </AlertTitle>
          <AlertCode id="own-code">ERR-9</AlertCode>
          <AlertText asChild>
            <p id="own-text">Own text</p>
          </AlertText>
        </Alert>
      )
      expect(
        screen.getByRole('alertdialog', { name: 'Own title', description: 'ERR-9 Own text' })
      ).toBeInTheDocument()
    })

    test('a caller id on AlertTitle still names the alert', () => {
      render(
        <Alert visible>
          <AlertTitle id="custom">Custom title</AlertTitle>
        </Alert>
      )
      expect(screen.getByRole('alertdialog', { name: 'Custom title' })).toBeInTheDocument()
    })

    test('lists descriptions in document order, whatever order they mounted in', () => {
      const Texts = ({ first }: { first: boolean }) => (
        <Alert visible>
          <AlertTitle>Title</AlertTitle>
          {first && <AlertText>First</AlertText>}
          <AlertText>Second</AlertText>
        </Alert>
      )
      const { rerender } = render(<Texts first={false} />)
      rerender(<Texts first />)
      expect(screen.getByRole('alertdialog', { description: 'First Second' })).toBeInTheDocument()
    })

    test('follows a description whose id changes, keeping its place', () => {
      const Texts = ({ id }: { id: string }) => (
        <Alert visible>
          <AlertTitle>Title</AlertTitle>
          <AlertText id={id}>First</AlertText>
          <AlertText>Second</AlertText>
        </Alert>
      )
      const { rerender } = render(<Texts id="a1" />)
      rerender(<Texts id="a2" />)
      expect(getDialog().getAttribute('aria-describedby')?.split(' ')[0]).toBe('a2')
      expect(screen.getByRole('alertdialog', { description: 'First Second' })).toBeInTheDocument()
    })

    test('renders the parts with their classes', () => {
      render(
        <Alert closeButton closeLabel="Dismiss" visible>
          <AlertIcon name="info-circle-solid" color="danger" data-testid="icon" />
          <AlertBody data-testid="body">
            <AlertTitle>Title</AlertTitle>
            <AlertCode>ERR-1</AlertCode>
            <AlertText>Text</AlertText>
          </AlertBody>
          <AlertFooter data-testid="footer" stacked>
            <AlertCancel>Cancel</AlertCancel>
          </AlertFooter>
        </Alert>
      )
      expect(screen.getByTestId('icon')).toHaveClass('alert-icon', 'icon-danger')
      expect(screen.getByTestId('body')).toHaveClass('alert-body')
      expect(screen.getByRole('heading', { name: 'Title' })).toHaveClass('alert-title')
      expect(screen.getByText('ERR-1')).toHaveClass('alert-code')
      expect(screen.getByText('ERR-1').tagName).toBe('CODE')
      expect(screen.getByText('Text').tagName).toBe('P')
      expect(screen.getByTestId('footer')).toHaveClass('alert-footer', 'stacked')
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('button', 'default')
      expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveClass('close-button')
    })
  })

  describe('closing', () => {
    test('AlertCancel asks to close, and a controlled alert waits for visible', () => {
      const onClose = vi.fn()
      const onVisibleChange = vi.fn()
      render(<ConfirmDelete onClose={onClose} onVisibleChange={onVisibleChange} visible />)
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(onVisibleChange).toHaveBeenCalledWith(false)
      expect(getDialog()).toHaveAttribute('open')
    })

    test('an uncontrolled alert closes itself from AlertCancel', () => {
      vi.useFakeTimers()
      render(<ConfirmDelete defaultVisible />)
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      act(() => vi.runAllTimers())
      expect(getDialog()).not.toHaveAttribute('open')
      vi.useRealTimers()
    })

    test("AlertCancel runs its own onClick first, and doesn't close when it prevents default", () => {
      const onClose = vi.fn()
      render(
        <Alert onClose={onClose} visible>
          <AlertTitle>Title</AlertTitle>
          <AlertCancel onClick={(event) => event.preventDefault()}>Cancel</AlertCancel>
        </Alert>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(onClose).not.toHaveBeenCalled()
    })

    test('Escape is blocked by default, and the alert bounces', () => {
      const onClose = vi.fn()
      const onClosePrevented = vi.fn()
      // With its transition, so the bounce lasts long enough to see.
      render(
        <ConfirmDelete
          instant={false}
          onClose={onClose}
          onClosePrevented={onClosePrevented}
          visible
        />
      )
      cancel()
      expect(onClose).not.toHaveBeenCalled()
      expect(onClosePrevented).toHaveBeenCalledTimes(1)
      expect(getDialog()).toHaveClass('dialog-static')
    })

    test('keyboard lets Escape close it', () => {
      const onClose = vi.fn()
      render(<ConfirmDelete keyboard onClose={onClose} visible />)
      cancel()
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    test('a backdrop click is blocked by default', () => {
      const onClose = vi.fn()
      const onClosePrevented = vi.fn()
      render(<ConfirmDelete onClose={onClose} onClosePrevented={onClosePrevented} visible />)
      fireEvent.click(getDialog())
      expect(onClose).not.toHaveBeenCalled()
      expect(onClosePrevented).toHaveBeenCalledTimes(1)
    })

    test('backdrop lets a backdrop click close it', () => {
      const onClose = vi.fn()
      render(<ConfirmDelete backdrop onClose={onClose} visible />)
      fireEvent.click(getDialog())
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    test('the close button asks to close', () => {
      const onClose = vi.fn()
      render(<ConfirmDelete closeButton onClose={onClose} visible />)
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('focus', () => {
    test('AlertCancel, the least destructive action, has focus when the alert opens', () => {
      const { rerender } = render(<ConfirmDelete visible={false} />)
      rerender(<ConfirmDelete visible />)
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
    })

    test('data-autofocus="false" opts an element out', () => {
      const Confirm = ({ visible }: { visible: boolean }) => (
        <Alert instant visible={visible}>
          <AlertTitle>Title</AlertTitle>
          <AlertCancel data-autofocus="false">Cancel</AlertCancel>
        </Alert>
      )
      const { rerender } = render(<Confirm visible={false} />)
      rerender(<Confirm visible />)
      expect(screen.getByRole('alertdialog', { name: 'Title' })).toHaveFocus()
    })

    test('an earlier element with data-autofocus takes focus instead', () => {
      const Confirm = ({ visible }: { visible: boolean }) => (
        <Alert instant visible={visible}>
          <AlertTitle>Type DELETE to confirm</AlertTitle>
          <input aria-label="Confirmation" data-autofocus="" />
          <AlertFooter>
            <AlertCancel>Cancel</AlertCancel>
          </AlertFooter>
        </Alert>
      )
      const { rerender } = render(<Confirm visible={false} />)
      rerender(<Confirm visible />)
      expect(screen.getByRole('textbox', { name: 'Confirmation' })).toHaveFocus()
    })
  })

  describe('inside a modal', () => {
    const Editor = ({ visible, autofocus }: { visible: boolean; autofocus?: boolean }) => (
      <Modal instant visible={visible}>
        <ModalTitle>Edit</ModalTitle>
        <ModalBody>
          <Alert>
            <AlertTitle>Discard changes?</AlertTitle>
            <AlertCancel>Keep editing</AlertCancel>
          </Alert>
          <input aria-label="Name" data-autofocus={autofocus ? '' : undefined} />
        </ModalBody>
      </Modal>
    )

    test("a closed alert's AlertCancel doesn't take the modal's initial focus", () => {
      const { rerender } = render(<Editor visible={false} />)
      rerender(<Editor visible />)
      expect(screen.getByRole('dialog', { name: 'Edit' })).toHaveFocus()
    })

    test("the modal's own data-autofocus element still gets it", () => {
      const { rerender } = render(<Editor autofocus visible={false} />)
      rerender(<Editor autofocus visible />)
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus()
    })
  })

  describe('a chain of alerts', () => {
    test('returns focus to the page trigger after the second alert closes', () => {
      vi.useFakeTimers()
      const Chain = () => {
        const [step, setStep] = React.useState<'none' | 'ask' | 'confirm'>('none')
        return (
          <>
            <Button onClick={() => setStep('ask')}>Delete account</Button>
            <Alert visible={step === 'ask'} onClose={() => setStep('none')}>
              <AlertTitle>First</AlertTitle>
              <Button onClick={() => setStep('confirm')}>Next</Button>
              <AlertCancel>Cancel first</AlertCancel>
            </Alert>
            <Alert visible={step === 'confirm'} onClose={() => setStep('none')}>
              <AlertTitle>Second</AlertTitle>
              <AlertCancel>Cancel second</AlertCancel>
            </Alert>
          </>
        )
      }
      render(<Chain />)
      const trigger = screen.getByRole('button', { name: 'Delete account' })
      act(() => trigger.focus())
      fireEvent.click(trigger)
      act(() => vi.runAllTimers())
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      act(() => vi.runAllTimers())
      expect(screen.getByRole('button', { name: 'Cancel second' })).toHaveFocus()

      fireEvent.click(screen.getByRole('button', { name: 'Cancel second' }))
      act(() => vi.runAllTimers())
      expect(trigger).toHaveFocus()
      vi.useRealTimers()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the dialog, and each part to its element', () => {
      const alertRef = React.createRef<HTMLDialogElement>()
      const titleRef = React.createRef<HTMLHeadingElement>()
      const cancelRef = React.createRef<HTMLButtonElement>()
      render(
        <Alert ref={alertRef} visible>
          <AlertTitle ref={titleRef}>Title</AlertTitle>
          <AlertCancel ref={cancelRef}>Cancel</AlertCancel>
        </Alert>
      )
      expect(alertRef.current).toBe(getDialog())
      expect(titleRef.current).toBe(screen.getByRole('heading', { name: 'Title' }))
      expect(cancelRef.current).toBe(screen.getByRole('button', { name: 'Cancel' }))
    })
  })

  describe('accessibility', () => {
    test('has no axe violations when open', async () => {
      const { container } = render(<ConfirmDelete closeButton visible withCode />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
