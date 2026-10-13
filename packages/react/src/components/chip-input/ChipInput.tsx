import React, {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'
import { useTextField } from 'react-aria'
import { Item, Key, useListState } from 'react-stately'

import { useControllableState, useForkedRef, useFormField, useHeldBack } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'
import { ChipList, ChipItem } from './ChipList'
import { isRTL } from '../../utils/direction'

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
   * Set component validation state to invalid. Left unset, the component shows as invalid by itself
   * from a submit it held back (an empty `required` one, say) until it no longer would, or its
   * form is reset. Set it, to `false` too, and it alone decides.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the chips when `invalid` is set, and after a
   * submit the field held back, until it no longer would.
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
   * Toggle the required state for the component. A required chip input with no chips holds its
   * form back from submitting, and its text input takes focus: text typed there and not added as
   * a chip is not a value.
   */
  required?: boolean
  /**
   * Character that creates a new chip when typed, or pasted text is split on. Set to `null` to
   * disable. Defaults to `,`.
   */
  separator?: string | null
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
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

// See `unaddedText`.
const UNADDED_TEXT_MESSAGE = 'Add the text as a chip.'

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
      invalid: invalidProp,
      invalidFeedback,
      label,
      maxChips,
      name,
      onChange,
      placeholder,
      required,
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
    // Shown as invalid from a submit it held back until it no longer would (`useHeldBack`):
    // react-aria cancels the browser's own message, and the form stayed with nothing to say why.
    const { invalid } = useHeldBack(inputRef, { invalid: invalidProp, valid })

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
        // Stepping backwards out of the text field and into the chips is a *visual* movement, so
        // the key that does it mirrors under RTL — ArrowLeft in an LTR field, ArrowRight in an RTL
        // one, matching where the chips actually sit relative to the caret. The caret check is
        // unchanged: `selectionStart === 0` is the start of the text in either direction.
        case 'ArrowLeft':
        case 'ArrowRight': {
          const input = inputRef.current
          if (!input) break
          const movesBackward = (event.key === 'ArrowLeft') !== isRTL(input)
          if (movesBackward && input.selectionStart === 0 && input.selectionEnd === 0) {
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
        // The merged `labelledBy`, not the raw props: a wrapping `FloatingInput` names the field
        // too, and react-aria puts an `aria-label` given beside `aria-labelledby` in front of it.
        'aria-label': ariaLabel ?? (labelledBy ? undefined : 'Add value'),
        'aria-labelledby': labelledBy,
        id: inputId,
        isDisabled: disabled,
        isInvalid: invalid,
        isRequired: required,
        onChange: setInputValue,
        onFocus: () => listState.selectionManager.clearSelection(),
        onKeyDown: handleKeyDown,
        placeholder,
        value: inputValue
      },
      inputRef
    )

    // Required asks for one chip at least, which HTML has no attribute for. The text input is
    // the field's one input a form validates (the chips' own are `type="hidden"`, which is barred
    // from it: FORMS.md, gotcha 9), so it carries the native `required` while there are no chips,
    // as each checkbox of a required `CheckboxGroup` does while none is checked. That alone would
    // let text through that was typed and never added: the input isn't empty, and nothing is
    // submitted under `name`. A custom validity covers it: text with no chips is invalid too. The
    // message is never shown: react-aria cancels the input's `invalid` event, which keeps a
    // browser's bubble away, and focuses the input instead. A disabled input isn't validated;
    // the field has no read-only state to leave out.
    const needsChip = Boolean(required) && tags.length === 0
    const unaddedText = needsChip && inputValue !== ''
    useEffect(() => {
      inputRef.current?.setCustomValidity(unaddedText ? UNADDED_TEXT_MESSAGE : '')
    }, [unaddedText])

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
          {/* `aria-describedby` after the spread: see `TextInput`. */}
          <input
            {...inputProps}
            aria-describedby={describedBy}
            // With no chips the native `required` says it; with chips react-aria's
            // `aria-required` still does, of a field that stays required.
            aria-required={needsChip ? undefined : inputProps['aria-required']}
            className="ghost-input"
            onPaste={handlePaste}
            ref={inputRef}
            required={needsChip || undefined}
          />
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
