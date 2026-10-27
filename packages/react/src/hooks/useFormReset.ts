import { RefObject, useEffect, useRef } from 'react'

/**
 * Puts a field back to its first value on a reset of its form, controlled or not, as react-aria's
 * text fields do (its own `useFormReset`, which `react-aria` doesn't export): `onReset` is called
 * with the value of the first render in the form's `reset` event, and the field reports it
 * through its own change path. The form is the one around the element given, or the one its
 * `form` attribute names when it is a form control; pass the attribute as `form`, so a change of
 * it listens to the new form.
 */
export function useFormReset<T>(
  ref: RefObject<Element | null>,
  initialValue: T,
  onReset: (initialValue: T) => void,
  form?: string
): void {
  const initial = useRef(initialValue)
  const onResetRef = useRef(onReset)
  onResetRef.current = onReset

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const owner = (node as HTMLInputElement).form ?? node.closest('form')
    if (!owner) return undefined
    const listener = () => onResetRef.current(initial.current)
    owner.addEventListener('reset', listener)
    return () => owner.removeEventListener('reset', listener)
  }, [ref, form])
}
