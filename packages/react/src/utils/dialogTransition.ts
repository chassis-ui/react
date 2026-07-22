// Shared timing + body-scroll-lock plumbing for native <dialog>-based components
// (CxModal, CxDrawer) built on the same Chassis CSS `dialog-open` body-lock contract.

export const getTransitionDuration = (element: HTMLElement) => {
  const { transitionDuration, transitionDelay } = window.getComputedStyle(element)
  const duration = Number.parseFloat(transitionDuration) || 0
  const delay = Number.parseFloat(transitionDelay) || 0
  if (!duration && !delay) return 0
  return (duration + delay) * 1000
}

export const executeAfterTransition = (
  element: HTMLElement,
  callback: () => void,
  animated: boolean,
) => {
  if (!animated) {
    callback()
    return () => undefined
  }

  let called = false
  const done = () => {
    if (called) return
    called = true
    element.removeEventListener('transitionend', handleEnd)
    clearTimeout(timer)
    callback()
  }
  const handleEnd = (event: Event) => {
    if (event.target === element) done()
  }
  element.addEventListener('transitionend', handleEnd)
  const timer = setTimeout(done, getTransitionDuration(element) + 50)
  return () => {
    element.removeEventListener('transitionend', handleEnd)
    clearTimeout(timer)
  }
}

// Dialogs (Modal, Drawer, …) currently locking body scroll, tracked so the lock
// is only released once every open modal dialog across every component has closed.
const openModalDialogs = new Set<HTMLDialogElement>()

export const dialogScrollLock = {
  lock(dialog: HTMLDialogElement) {
    openModalDialogs.add(dialog)
    document.body.classList.add('dialog-open')
  },
  unlock(dialog: HTMLDialogElement) {
    if (openModalDialogs.delete(dialog) && openModalDialogs.size === 0) {
      document.body.classList.remove('dialog-open')
    }
  },
}
