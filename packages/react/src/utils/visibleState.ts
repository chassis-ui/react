import { devWarning } from './devWarning'

// The open-state props of every component that can show and hide itself (see `CONVENTIONS.md`):
// `visible` is controlled, `defaultVisible` is the initial state of an uncontrolled component, and
// `onVisibleChange` reports each change the component asks for. Each component declares the three
// itself, so its prop table says what asks for a change there.
export interface VisibleStateProps {
  defaultVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
  visible?: boolean
}

/**
 * Warns when a component asks to show or hide and nothing can follow the request: `visible` is
 * set and there is no `onVisibleChange`. Holding a component open or closed that way is allowed,
 * so this reports only a request that was dropped, not the props themselves.
 */
export function warnDroppedVisibleRequest(
  { onVisibleChange, visible }: VisibleStateProps,
  next: boolean,
  displayName: string
): void {
  devWarning(
    visible !== undefined && !onVisibleChange,
    `${displayName}: asked to ${next ? 'show' : 'hide'}, but \`visible\` is set and there is no ` +
      '`onVisibleChange`, so nothing changed. Pass `onVisibleChange` to follow its requests, or ' +
      '`defaultVisible` to set only the initial state.'
  )
}
