import React, { HTMLAttributes, KeyboardEvent, ReactNode, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { useTextField } from 'react-aria'
import { Item, Key, useListState } from 'react-stately'

import { useControllableState, useFormField } from '../../hooks'
import { renderFormField } from '../form-field/renderFormField'
import { ChipList, ChipItem } from './ChipList'

export interface ChipInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * An accessible label for the chip group, used when there's no visible `<label>`.
   */
  'aria-label'?: string
  /**
   * Identifies a visible `<label>` element for the chip group.
   */
  'aria-labelledby'?: string
  /**
   * Allow the same value to be added more than once. Defaults to `false`.
   */
  allowDuplicates?: boolean
  /**
   * Space-separated chassis-css chip modifier classes (e.g. `"primary smooth"`) applied to every
   * chip.
   */
  chipVariant?: string
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The initial set of chip values (uncontrolled).
   */
  defaultValue?: string[]
  /**
   * Prevents new chips from being added and makes existing chips non-interactive.
   */
  disabled?: boolean
  /**
   * A description for the field, rendered below the chips.
   */
  help?: ReactNode
  /**
   * `id` forwarded to the text input — useful for pairing with a `<label for>`.
   */
  id?: string
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the chips when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `FormLabel` associated with the text input.
   */
  label?: ReactNode
  /**
   * Maximum number of chips allowed. Omit for no limit.
   */
  maxChips?: number
  /**
   * `name` of an auto-created hidden input per chip, kept in sync with the values, for native
   * form submission. Omit to skip creating them.
   */
  name?: string
  /**
   * Callback fired whenever a chip is added or removed.
   */
  onChange?: (values: string[]) => void
  /**
   * Placeholder shown in the input when empty.
   */
  placeholder?: string
  /**
   * Character that creates a new chip when typed, or pasted text is split on. Set to `null` to
   * disable. Defaults to `,`.
   */
  separator?: string | null
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the chips when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The set of chip values (controlled).
   */
  value?: string[]
}

export const ChipInput = ({
  allowDuplicates = false,
  chipVariant,
  className,
  defaultValue,
  disabled,
  help,
  id,
  invalid,
  invalidFeedback,
  label,
  maxChips,
  name,
  onChange,
  placeholder,
  separator = ',',
  size,
  valid,
  validFeedback,
  value,
  ...rest
}: ChipInputProps): ReactNode => {
  const [tags, updateTags] = useControllableState<string[]>(value, defaultValue ?? [], onChange)

  const addTag = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (!allowDuplicates && tags.includes(trimmed)) return
    if (maxChips != null && tags.length >= maxChips) return
    updateTags([...tags, trimmed])
  }

  const removeTags = (keys: Iterable<Key>) => {
    const toRemove = new Set(keys)
    updateTags(tags.filter((tag) => !toRemove.has(tag)))
  }

  const items = useMemo<ChipItem[]>(() => tags.map((tag) => ({ id: tag, value: tag })), [tags])

  const listState = useListState<ChipItem>({
    children: (item: ChipItem) => (
      <Item key={item.id} textValue={item.value}>
        {item.value}
      </Item>
    ),
    disabledKeys: disabled ? tags : undefined,
    items,
    selectionMode: 'multiple'
  })

  const groupRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState('')

  const focusLastChip = (extend: boolean) => {
    if (tags.length === 0) return
    const lastKey = tags[tags.length - 1]!
    if (extend) {
      listState.selectionManager.extendSelection(lastKey)
    } else {
      listState.selectionManager.replaceSelection(lastKey)
    }
    const rows = groupRef.current?.querySelectorAll<HTMLElement>('[role="row"]')
    rows?.[rows.length - 1]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (separator && event.key === separator) {
      event.preventDefault()
      addTag(inputValue)
      setInputValue('')
      return
    }

    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        addTag(inputValue)
        setInputValue('')
        break
      }
      case 'Backspace':
      case 'Delete': {
        if (inputValue === '') {
          event.preventDefault()
          focusLastChip(false)
        }
        break
      }
      case 'ArrowLeft': {
        const input = inputRef.current
        if (input && input.selectionStart === 0 && input.selectionEnd === 0) {
          event.preventDefault()
          focusLastChip(event.shiftKey)
        }
        break
      }
      case 'Escape': {
        setInputValue('')
        listState.selectionManager.clearSelection()
        inputRef.current?.blur()
        break
      }
      default:
        break
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (!separator) return
    const pasted = event.clipboardData.getData('text')
    if (!pasted.includes(separator)) return

    event.preventDefault()
    const parts = pasted.split(separator)

    // Accumulate locally rather than calling `addTag` per part: each call to `addTag` reads
    // `tags` from this render's closure, so several calls in a row within one event would all
    // start from the same stale array instead of building on each other.
    let next = tags
    for (const part of parts.slice(0, -1)) {
      const trimmed = part.trim()
      if (!trimmed) continue
      if (!allowDuplicates && next.includes(trimmed)) continue
      if (maxChips != null && next.length >= maxChips) break
      next = [...next, trimmed]
    }
    if (next !== tags) updateTags(next)
    setInputValue(parts[parts.length - 1] ?? '')
  }

  const { describedBy, feedbackId, helpId, inputId, labelId, labelledBy } = useFormField({
    ariaDescribedBy: rest['aria-describedby'],
    ariaLabelledBy: rest['aria-labelledby'],
    help,
    id,
    invalid,
    invalidFeedback,
    label,
    valid,
    validFeedback
  })

  const { inputProps } = useTextField(
    {
      'aria-describedby': describedBy,
      'aria-label':
        rest['aria-label'] ?? (rest['aria-labelledby'] || label ? undefined : 'Add value'),
      'aria-labelledby': labelledBy,
      id: inputId,
      isDisabled: disabled,
      isInvalid: invalid,
      onChange: setInputValue,
      onFocus: () => listState.selectionManager.clearSelection(),
      onKeyDown: handleKeyDown,
      placeholder,
      value: inputValue
    },
    inputRef
  )

  return renderFormField({
    children: (
      <div
        className={classNames(
          'form-input',
          'chip-input',
          { small: size === 'small', large: size === 'large', disabled },
          { 'is-invalid': invalid, 'is-valid': valid },
          className
        )}
        {...rest}
      >
        <ChipList
          chipVariant={chipVariant}
          groupRef={groupRef}
          props={{
            'aria-label': rest['aria-label'],
            'aria-labelledby': labelledBy,
            onRemove: disabled ? undefined : removeTags
          }}
          state={listState}
        />
        <input {...inputProps} className="ghost-input" onPaste={handlePaste} ref={inputRef} />
        {name && tags.map((tag) => <input key={tag} name={name} type="hidden" value={tag} />)}
      </div>
    ),
    help,
    ids: { feedback: feedbackId, help: helpId, input: inputId, label: labelId },
    invalid,
    invalidFeedback,
    label,
    valid,
    validFeedback
  })
}

ChipInput.displayName = 'ChipInput'
