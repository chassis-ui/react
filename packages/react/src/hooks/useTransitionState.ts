import { RefObject, useRef, useState } from 'react'

import { executeAfterTransition } from '../utils/dialogTransition'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * Where a component is in its show/hide cycle. `exited` is mounted and hidden, `unmounted` is
 * not rendered at all.
 */
export type TransitionPhase = 'unmounted' | 'exited' | 'entering' | 'entered' | 'exiting'

export interface UseTransitionStateOptions {
  /**
   * Plays the enter transition on the first mount too, when `in` is already `true`. Without it
   * a component mounted visible starts settled, in `entered`.
   */
  appear?: boolean
  /**
   * Whether the component is shown.
   */
  in: boolean
  /**
   * Keeps the component out of the DOM until it is first shown.
   */
  mountOnEnter?: boolean
  /**
   * The element the classes are applied to. Its own CSS transition decides how long `entering`
   * and `exiting` last.
   */
  nodeRef: RefObject<HTMLElement | null>
  /**
   * Fires before `entering` is rendered, while the element still has its hidden styles.
   */
  onEnter?: () => void
  /**
   * Fires once `entering` is in the DOM, before the browser paints it.
   */
  onEntering?: () => void
  /**
   * Fires when the enter transition has finished.
   */
  onEntered?: () => void
  /**
   * Fires before `exiting` is rendered, while the element still has its shown styles.
   */
  onExit?: () => void
  /**
   * Fires once `exiting` is in the DOM, before the browser paints it.
   */
  onExiting?: () => void
  /**
   * Fires when the exit transition has finished. With `unmountOnExit` the element is still in
   * the DOM at this point.
   */
  onExited?: () => void
  /**
   * Takes the component out of the DOM once it has exited.
   */
  unmountOnExit?: boolean
}

export interface UseTransitionStateResult {
  /**
   * `false` while there is nothing to render.
   */
  isMounted: boolean
  phase: TransitionPhase
}

const forceReflow = (node: HTMLElement | null) => void node?.offsetHeight

// The show/hide state machine behind `Collapse`, `TabPanel`, `Toast`, `Notification`, `Tooltip`
// and `Popover`. It only reports a phase. Each component maps phases to chassis-css's classes
// (`fade`, `show`, `showing`, `collapsing`), because those mappings differ.
//
// A phase lasts as long as the element's own CSS transition: it ends on `transitionend`, or
// after the computed duration when that event never comes (`executeAfterTransition`, which
// chassis-css's own plugins and `Modal`/`Drawer`/`Menu` use too). Nothing here holds a duration,
// so a theme that changes one, and `prefers-reduced-motion`, under which chassis-css sets
// `transition: none`, are followed without a second source of truth.
//
// Every step runs in a layout effect, so the browser never paints a state between two steps,
// and a step that needs the previous styles computed first (an element that was just mounted,
// or `display: none` a moment ago) forces a reflow itself.
export function useTransitionState({
  appear = false,
  in: inProp,
  mountOnEnter = false,
  nodeRef,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  unmountOnExit = false
}: UseTransitionStateOptions): UseTransitionStateResult {
  const [phase, setPhaseState] = useState<TransitionPhase>(() => {
    if (inProp) return appear ? 'exited' : 'entered'
    return mountOnEnter || unmountOnExit ? 'unmounted' : 'exited'
  })

  // Mirrors `phase` at the moment it is set, not at the next render: StrictMode runs the effect
  // below twice on mount, and the second run has to see that the first already started.
  const phaseRef = useRef(phase)
  const setPhase = (next: TransitionPhase) => {
    phaseRef.current = next
    setPhaseState(next)
  }

  // Read through a ref so a caller can pass inline callbacks without restarting a transition.
  const callbacks = { onEnter, onEntering, onEntered, onExit, onExiting, onExited }
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  useIsomorphicLayoutEffect(() => {
    const current = phaseRef.current
    const isIn = current === 'entering' || current === 'entered'
    if (inProp === isIn) return

    if (inProp) {
      forceReflow(nodeRef.current)
      callbacksRef.current.onEnter?.()
      setPhase('entering')
    } else {
      callbacksRef.current.onExit?.()
      setPhase('exiting')
    }
  }, [inProp])

  useIsomorphicLayoutEffect(() => {
    if (phase !== 'entering' && phase !== 'exiting') return undefined

    const finish = () => {
      if (phase === 'entering') {
        setPhase('entered')
        callbacksRef.current.onEntered?.()
      } else {
        setPhase(unmountOnExit ? 'unmounted' : 'exited')
        callbacksRef.current.onExited?.()
      }
    }

    if (phase === 'entering') callbacksRef.current.onEntering?.()
    else callbacksRef.current.onExiting?.()

    // Nothing rendered means nothing to wait for.
    const node = nodeRef.current
    if (!node) {
      finish()
      return undefined
    }
    return executeAfterTransition(node, finish, true)
  }, [phase])

  // Shown while still `unmounted`: render it hidden in this same pass, so the element exists
  // when the effect above starts the enter from it.
  const rendered = inProp && phase === 'unmounted' ? 'exited' : phase

  return { isMounted: rendered !== 'unmounted', phase: rendered }
}
