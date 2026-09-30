import { useCallback, useRef } from 'react'

import { devWarning } from '../utils/devWarning'
import { VisibleStateProps, warnDroppedVisibleRequest } from '../utils/visibleState'

// The names react-aria gives the same three props. `DatePicker` and `DateRangePicker` took them
// under these names first; they are deprecated in favour of the `visible` ones, which win when
// both are passed.
export interface DeprecatedOpenStateProps {
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

const DEPRECATED_OPEN_STATE_PROPS = [
  ['isOpen', 'visible'],
  ['defaultOpen', 'defaultVisible'],
  ['onOpenChange', 'onVisibleChange']
] as const

/**
 * `visible`/`defaultVisible`/`onVisibleChange` as react-stately's trigger states take them
 * (`useOverlayTriggerState`, `useTooltipTriggerState`, `useMenuTriggerState`, the date picker
 * states). Those states are controlled by `isOpen` already, and call `onOpenChange` only for a
 * value that differs from the current one.
 *
 * `onOpenChange` keeps one identity. The state's `open`/`close`/`toggle` are rebuilt whenever it
 * changes, and components subscribe to window events in effects that depend on them.
 */
export function useOpenStateProps(
  props: VisibleStateProps & DeprecatedOpenStateProps,
  displayName: string
) {
  for (const [deprecated, replacement] of DEPRECATED_OPEN_STATE_PROPS) {
    devWarning(
      props[deprecated] !== undefined,
      `${displayName}: the ${deprecated} prop is deprecated, use ${replacement} instead. It ` +
        'will be removed in a future major version.'
    )
  }

  const propsRef = useRef(props)
  propsRef.current = props

  const onOpenChange = useCallback(
    (next: boolean) => {
      const current = propsRef.current
      warnDroppedVisibleRequest(
        {
          onVisibleChange: current.onVisibleChange ?? current.onOpenChange,
          visible: current.visible ?? current.isOpen
        },
        next,
        displayName
      )
      current.onVisibleChange?.(next)
      current.onOpenChange?.(next)
    },
    [displayName]
  )

  return {
    defaultOpen: props.defaultVisible ?? props.defaultOpen,
    isOpen: props.visible ?? props.isOpen,
    onOpenChange
  }
}
