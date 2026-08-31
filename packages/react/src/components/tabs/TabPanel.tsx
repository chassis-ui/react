import React, { forwardRef, HTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { useTabPanel } from 'react-aria'
import { Key } from 'react-stately'
import { Transition } from 'react-transition-group'

import { useForkedRef } from '../../hooks'
import { useTabsContext } from './context'

export interface TabPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  /**
   * Content of the panel, shown while the `Tab` of the same `id` is selected.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Pairs this panel with the `Tab` of the same `id`.
   */
  id: Key
}

// The counterpart to `Tab` — unlike `Tab`, `TabPanel` renders for real, but only while its `id`
// matches the currently selected tab, and unmounts immediately (not staggered) once it isn't.
// chassis-css's `.tab-content > .tab-pane`/`.active` rule (`_transitions.scss`) assumes exactly
// one visible block-level panel at a time — there's no overlap/positioning support for a second
// panel to occupy the same space while it exits, so staggering the *outgoing* panel's removal
// would leave two full-height panels stacked in flow simultaneously and visibly shove the layout
// around. Only the *incoming* panel gets a transition: `Transition`'s `appear` flag makes its
// mount start a render frame without the `show` class — `fade` alone means `opacity: 0` —
// before adding it a tick later, so the panel fades in instead of popping straight to full
// opacity. `appear` is gated on `isInitialSelectionRef` so only an actual tab *switch* animates,
// not whichever panel happens to be selected on first paint.
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, className, id, ...rest }, ref) => {
    const { state, isInitialSelectionRef } = useTabsContext()
    const panelRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, panelRef)
    const { tabPanelProps } = useTabPanel({ id }, state, panelRef)

    if (state.selectedKey !== id) return null

    return (
      <Transition in appear={!isInitialSelectionRef.current} nodeRef={panelRef} timeout={150}>
        {(transitionState) => (
          <div
            className={classNames(
              'tab-pane',
              'fade',
              'active',
              { show: transitionState === 'entered' },
              className
            )}
            {...tabPanelProps}
            {...rest}
            ref={forkedRef}
          >
            {children}
          </div>
        )}
      </Transition>
    )
  }
)

TabPanel.displayName = 'TabPanel'
