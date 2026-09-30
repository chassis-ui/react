import React, {
  createContext,
  DialogHTMLAttributes,
  forwardRef,
  useCallback,
  useContext,
  useState
} from 'react'
import classNames from 'classnames'

import { useDialogElement } from '../../hooks'
import { joinIds } from '../../utils/idRefs'
import { CloseButton } from '../close-button/CloseButton'

export interface AlertProps extends Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'onCancel' | 'onClose'
> {
  /**
   * Whether a click on the backdrop closes the alert. By default it doesn't (`'static'`): the
   * alert bounces, since an alert dialog waits for an explicit choice. Set `true` to let it close.
   */
  backdrop?: true | 'static'
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Adds a close button in the corner, for an alert that needs a way out besides its actions.
   */
  closeButton?: boolean
  /**
   * The close button's accessible name. Defaults to `'Close'`; set it for non-English UIs.
   */
  closeLabel?: string
  /**
   * Whether the alert is open when it first renders. Such an alert is uncontrolled: it closes
   * itself on a close request. Use `visible` to open and close it from outside.
   */
  defaultVisible?: boolean
  /**
   * Disable the open/close transition entirely.
   */
  instant?: boolean
  /**
   * Whether the Escape key closes the alert. By default it doesn't: the alert bounces instead.
   */
  keyboard?: boolean
  /**
   * Renders the alert open from its first paint, server HTML included, as a non-modal dialog: a
   * static preview. It stays open until a close request. Use `visible` or `defaultVisible` to
   * open it as a modal dialog.
   */
  open?: boolean
  /**
   * Callback fired when the alert asks to be closed: `AlertCancel`, the close button, and, when
   * allowed, Escape or a backdrop click.
   */
  onClose?: () => void
  /**
   * Callback fired when a close attempt is blocked: a click on a static backdrop, or Escape
   * while `keyboard` is off.
   */
  onClosePrevented?: () => void
  /**
   * Callback fired after the exit transition completes and the alert is fully hidden.
   */
  onHidden?: () => void
  /**
   * Callback fired when the alert starts to open.
   */
  onShow?: () => void
  /**
   * Callback fired after the entry transition completes and the alert is fully visible.
   */
  onShown?: () => void
  /**
   * Callback fired with `false` when the alert asks to be closed, at the same moments as
   * `onClose`. It makes `visible` and `onVisibleChange` a pair that takes a state setter.
   */
  onVisibleChange?: (visible: boolean) => void
  /**
   * Whether the alert is open. The alert is then controlled: a close request only fires `onClose`
   * and `onVisibleChange`, and the alert closes when this becomes `false`.
   */
  visible?: boolean
}

export type AlertPartKind = 'title' | 'description'

export interface AlertContextProps {
  /**
   * Asks the alert to close: fires `onClose` and `onVisibleChange(false)`.
   */
  close: () => void
  /**
   * Adds a rendered element to the alert's `aria-labelledby` (a title) or `aria-describedby` (a
   * code or text), under the id it has in the DOM, and returns the function that takes it out.
   * The parts call it through `useAlertPart`.
   */
  registerPart: (kind: AlertPartKind, node: HTMLElement, id: string) => () => void
}

export const AlertContext = createContext<AlertContextProps>({
  close: () => {},
  registerPart: () => () => {}
})

export const useAlertContext = () => useContext(AlertContext)

// chassis-css's alert dialog: a `<dialog class="alert dialog" role="alertdialog">`, opened with
// `showModal()` by the same machinery as `Modal` (`useDialogElement`). What differs is the
// defaults an alert dialog wants (a static backdrop, no Escape) and how it is named and
// described. `aria-labelledby` and `aria-describedby` list the `AlertTitle`, `AlertCode` and
// `AlertText` elements that are rendered, under the ids they have in the DOM (a child's own id
// under `asChild`, a caller's `id`), in document order. The parts register from a layout effect
// (`useAlertPart`), so the server's HTML names no id that isn't in it, and both attributes are
// set before the first paint.
export const Alert = forwardRef<HTMLDialogElement, AlertProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      backdrop = 'static',
      children,
      className,
      closeButton,
      closeLabel,
      defaultVisible,
      instant,
      keyboard = false,
      onClick,
      onClose,
      onClosePrevented,
      onHidden,
      onShow,
      onShown,
      onVisibleChange,
      open,
      visible,
      ...rest
    },
    ref
  ) => {
    const { close, forkedRef, handleBackdropClick, handleCancel, hiding, staticBounce } =
      useDialogElement({
        backdrop,
        defaultVisible,
        instant,
        isModal: true,
        keyboard,
        onClick,
        onClose,
        onClosePrevented,
        onHidden,
        onShow,
        onShown,
        onVisibleChange,
        open,
        ref,
        visible
      })

    const [parts, setParts] = useState<{ id: string; kind: AlertPartKind; node: HTMLElement }[]>([])
    const registerPart = useCallback((kind: AlertPartKind, node: HTMLElement, id: string) => {
      const part = { id, kind, node }
      setParts((current) => [...current, part])
      return () => setParts((current) => current.filter((entry) => entry !== part))
    }, [])

    const idsOf = (kind: AlertPartKind) =>
      parts
        .filter((part) => part.kind === kind)
        .sort((a, b) =>
          a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        )
        .map(({ id }) => id)
    // An empty string counts as unset.
    const labelledBy = ariaLabelledBy || joinIds(...idsOf('title'))
    const describedBy = ariaDescribedBy || joinIds(...idsOf('description'))

    const contextValue = { close, registerPart }

    return (
      <AlertContext.Provider value={contextValue}>
        <dialog
          aria-describedby={describedBy}
          aria-labelledby={labelledBy}
          role="alertdialog"
          {...rest}
          open={open}
          className={classNames(
            'alert',
            'dialog',
            { instant, hiding, 'dialog-static': staticBounce },
            className
          )}
          onCancel={handleCancel}
          onClick={handleBackdropClick}
          ref={forkedRef}
        >
          {children}
          {closeButton && <CloseButton label={closeLabel} onClick={close} />}
        </dialog>
      </AlertContext.Provider>
    )
  }
)

Alert.displayName = 'Alert'
