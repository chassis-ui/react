import React, {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useMemo,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'
import { useTextField } from 'react-aria'
import { Item, Key, useListState } from 'react-stately'

import { useControllableState, useForkedRef, useFormField } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'
import { ChipList, ChipItem } from './ChipList'

// `allowDuplicates` means two tags can share a value, but react-stately's collection needs a
// unique key per item — keying on the value alone collapses duplicates into the same node, so
// selecting or removing one affects all of them. Key on (value, occurrence-within-the-array)
// instead, recomputed fresh from `tags` on every call rather than cached, so it stays correct
// whether the array changed via our own add/remove or via an externally-controlled `value` prop.
const buildTagIds = (list: string[]): string[] => {
  const seen = new Map<string, number>()
  return list.map((tag) => {
    const occurrence = seen.get(tag) ?? 0
    seen.set(tag, occurrence + 1)
    return occurrence === 0 ? tag : `${tag}\u0000${occurrence}`
  })
}

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
   * chip. Defaults to `"default"`.
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

export const ChipInput = forwardRef<HTMLDivElement, ChipInputProps>(
  (
    {
      allowDuplicates = false,
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      chipVariant = 'default',
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
    }: ChipInputProps,
    ref
  ): ReactNode => {
    const [tags, updateTags] = useControllableState<string[]>(value, defaultValue ?? [], onChange)

    // The one memoized computation of `tags`' ids — `removeTags`, `items`, and `focusLastChip`
    // below all used to independently recompute this same array from scratch (fresh on every
    // render, not just when `tags` actually changed); they now all read this instead.
    const ids = useMemo(() => buildTagIds(tags), [tags])

    // Shared by `addTag` and the paste handler's loop: whether `raw` (already trimmed) is
    // addable to `list` given `allowDuplicates`. `maxChips` is deliberately not part of this
    // predicate — the paste loop needs to `break` (stop entirely) on hitting the limit, while an
    // empty/duplicate value should just be skipped and the loop should keep going.
    const isAddableValue = (list: string[], trimmed: string) =>
      trimmed !== '' && (allowDuplicates || !list.includes(trimmed))

    const addTag = (raw: string) => {
      const trimmed = raw.trim()
      if (!isAddableValue(tags, trimmed)) return
      if (maxChips != null && tags.length >= maxChips) return
      updateTags([...tags, trimmed])
    }

    const removeTags = (keys: Iterable<Key>) => {
      const toRemove = new Set(keys)
      updateTags(tags.filter((_tag, index) => !toRemove.has(ids[index]!)))
    }

    const items = useMemo<ChipItem[]>(
      () => tags.map((tag, index) => ({ id: ids[index]!, value: tag })),
      [tags, ids]
    )

    const listState = useListState<ChipItem>({
      children: (item: ChipItem) => (
        <Item key={item.id} textValue={item.value}>
          {item.value}
        </Item>
      ),
      disabledKeys: disabled ? items.map((item) => item.id) : undefined,
      items,
      selectionMode: 'multiple'
    })

    const groupRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, containerRef)
    const inputRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState('')

    const focusLastChip = (extend: boolean) => {
      if (tags.length === 0) return
      const lastKey = ids[ids.length - 1]!
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
      if (disabled || !separator) return
      const pasted = event.clipboardData.getData('text')
      if (!pasted.includes(separator)) return

      event.preventDefault()
      const parts = pasted.split(separator)

      // Accumulate locally rather than calling `addTag` per part: each call to `addTag` reads
      // `tags` from this render's closure, so several calls in a row within one event would all
      // start from the same stale array instead of building on each other.
      let next = tags
      // `i` tracks how far the loop got, so a `maxChips` cutoff can leave everything from that
      // point on (not just the final unsplit part) in the input instead of silently dropping it.
      let i = 0
      for (; i < parts.length - 1; i++) {
        if (maxChips != null && next.length >= maxChips) break
        const trimmed = parts[i]!.trim()
        if (!isAddableValue(next, trimmed)) continue
        next = [...next, trimmed]
      }
      if (next !== tags) updateTags(next)
      setInputValue(parts.slice(i).join(separator))
    }

    const { describedBy, feedbackId, helpId, inputId, labelId, labelledBy } = useFormField({
      ariaDescribedBy,
      ariaLabelledBy,
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
        'aria-label': ariaLabel ?? (ariaLabelledBy || label ? undefined : 'Add value'),
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
            size,
            { disabled },
            validationClassName(invalid, valid),
            className
          )}
          {...rest}
          ref={forkedRef}
        >
          <ChipList
            chipVariant={chipVariant}
            disabled={disabled}
            groupRef={groupRef}
            props={{
              'aria-label': ariaLabel,
              'aria-labelledby': labelledBy,
              onRemove: disabled ? undefined : removeTags
            }}
            size={size}
            state={listState}
          />
          <input {...inputProps} className="ghost-input" onPaste={handlePaste} ref={inputRef} />
          {name &&
            items.map((item) => (
              <input
                disabled={disabled}
                key={item.id}
                name={name}
                type="hidden"
                value={item.value}
              />
            ))}
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
)

ChipInput.displayName = 'ChipInput'
