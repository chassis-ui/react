import { mergeProps } from 'react-aria'

// Every hook reads these through `filterDOMProps`' `labelable` option, and a component merges
// its own ids into them (`useFormField`'s `labelledBy`/`describedBy`, `useField`'s label id), so
// the caller's raw value must not win again (FORMS.md, gotcha 4).
const LABELLING_PROPS = ['aria-describedby', 'aria-details', 'aria-label', 'aria-labelledby', 'id']

// Read by `useFocusable`, which every focusable input hook calls.
const FOCUSABLE_PROPS = ['autoFocus', 'onBlur', 'onFocus', 'onKeyDown', 'onKeyUp']

// Read by `useTextField`, and by `useNumberField` through it.
export const TEXT_FIELD_PROPS = [
  ...FOCUSABLE_PROPS,
  'defaultValue',
  'onBeforeInput',
  'onChange',
  'onCompositionEnd',
  'onCompositionStart',
  'onCompositionUpdate',
  'onCopy',
  'onCut',
  'onInput',
  'onPaste',
  'onSelect',
  'value'
]

// Read by `useToggle` (`useCheckbox`, `useCheckboxGroupItem`, `useSwitch`) and by `useRadio`.
export const TOGGLE_PROPS = [...FOCUSABLE_PROPS, 'onChange', 'onClick', 'value']

// A react-aria hook's DOM props, with the props it didn't handle merged after them. A hook
// returns only the few props it knows (`filterDOMProps` without its `global` and `events`
// options), so a `title`, `dir`, `lang`, `onClick` or `tabIndex` given to the component never
// reached the element. `mergeProps` runs both of two event handlers and lets the caller's value
// win otherwise. `handled` names the props the hook reads itself: its handlers would run twice,
// and its values would undo what the hook made of them.
export const mergeUnhandledProps = <T extends object>(
  hookProps: T,
  props: object,
  handled: readonly string[] = []
): T => {
  const unhandled: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (!LABELLING_PROPS.includes(key) && !handled.includes(key)) unhandled[key] = value
  }
  return mergeProps(hookProps, unhandled) as T
}
