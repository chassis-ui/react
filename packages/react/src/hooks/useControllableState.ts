import { useState } from 'react'

/**
 * Shared controlled/uncontrolled state pattern: `value` present means controlled (the returned
 * state always mirrors it), otherwise state is tracked internally starting from `defaultValue`.
 * The returned setter updates internal state (when uncontrolled) and always calls `onChange`,
 * leaving the caller free to layer additional logic (e.g. an `onComplete` callback) around it.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (next: T) => void] {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue)
  const state = isControlled ? (value as T) : uncontrolledValue

  const setState = (next: T) => {
    if (!isControlled) setUncontrolledValue(next)
    onChange?.(next)
  }

  return [state, setState]
}
