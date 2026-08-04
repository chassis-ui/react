// Shared transition timing for native <dialog>-based components (Modal, Drawer). Body-scroll
// locking is handled by react-aria's usePreventScroll directly in each component.

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
  animated: boolean
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
