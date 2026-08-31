import React, {
  ClipboardEvent,
  forwardRef,
  Fragment,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useMemo,
  useRef
} from 'react'
import classNames from 'classnames'

import { useControllableState, useForkedRef, useFormField } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'
import { OtpBox } from './OtpBox'

export interface OtpInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * Identifies the element that describes the group, e.g. a `FormHelp` help element.
   */
  'aria-describedby'?: string
  /**
   * An accessible label for the group, used when there's no visible `<label>`.
   */
  'aria-label'?: string
  /**
   * Identifies a visible `<label>` element for the group.
   */
  'aria-labelledby'?: string
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The initial code (uncontrolled), e.g. `"123"` for a partially filled code.
   */
  defaultValue?: string
  /**
   * Prevents input and makes every box non-interactive.
   */
  disabled?: boolean
  /**
   * Splits the boxes into groups (e.g. `[3, 3]` for a "123-456" layout), rendering a
   * `.form-otp-separator` between each group. The total number of boxes becomes the sum of
   * `groupSizes`, overriding `length`.
   */
  groupSizes?: number[]
  /**
   * A description for the field, rendered below the boxes.
   */
  help?: ReactNode
  /**
   * `id` forwarded to the group container.
   */
  id?: string
  /**
   * Visually connects the boxes into a single bordered control. When `groupSizes` is set, each
   * group is connected separately.
   */
  inputGroup?: boolean
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the boxes when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `FormLabel` associated with the group via
   * `aria-labelledby` (there's no single input to target with `htmlFor`).
   */
  label?: ReactNode
  /**
   * Number of digit boxes. Ignored when `groupSizes` is set. Defaults to `6`.
   */
  length?: number
  /**
   * Mask entered digits using `type="password"` boxes.
   */
  mask?: boolean
  /**
   * `name` of an auto-created hidden input kept in sync with the code, for native form
   * submission. Omit to skip creating it.
   */
  name?: string
  /**
   * Callback fired whenever the code changes.
   */
  onChange?: (value: string) => void
  /**
   * Callback fired once every box is filled.
   */
  onComplete?: (value: string) => void
  /**
   * Content of the separator rendered between groups when `groupSizes` is set. Defaults to `–`.
   */
  separator?: ReactNode
  /**
   * Size the boxes small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the boxes when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The code (controlled), digits only, e.g. `"123456"`.
   */
  value?: string
}

const onlyDigits = (raw: string) => raw.replace(/\D/g, '')

const toBoxes = (raw: string, total: number): string[] => {
  const digits = [...onlyDigits(raw)].slice(0, total)
  return Array.from({ length: total }, (_, i) => digits[i] ?? '')
}

export const OtpInput = forwardRef<HTMLDivElement, OtpInputProps>(
  (
    {
      className,
      defaultValue,
      disabled,
      groupSizes,
      help,
      id,
      inputGroup,
      invalid,
      invalidFeedback,
      label,
      length = 6,
      mask,
      name,
      onChange,
      onComplete,
      separator = '–',
      size,
      valid,
      validFeedback,
      value,
      ...rest
    }: OtpInputProps,
    ref
  ): ReactNode => {
    const total =
      groupSizes && groupSizes.length > 0 ? groupSizes.reduce((a, b) => a + b, 0) : length

    const [rawValue, setRawValue] = useControllableState(value, defaultValue ?? '', onChange)
    const boxes = useMemo(() => toBoxes(rawValue, total), [rawValue, total])

    const boxRefs = useRef<Array<HTMLInputElement | null>>([])
    const focusBox = (index: number) => boxRefs.current[index]?.focus()
    const containerRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, containerRef)

    const commit = (nextBoxes: string[]) => {
      const next = nextBoxes.join('')
      setRawValue(next)
      if (nextBoxes.length === total && nextBoxes.every((box) => box !== '')) {
        onComplete?.(next)
      }
    }

    const handleChange = (index: number, raw: string) => {
      const digits = onlyDigits(raw)

      if (digits.length > 1) {
        // Multi-character value landing in a single box (autofill, or a fast typist outrunning
        // the auto-advance) — distribute across this and subsequent boxes, matching chassis-css's
        // vanilla otp-input.js `_handleInput`.
        const chars = [...digits]
        const nextBoxes = [...boxes]
        for (let i = 0; i < chars.length && index + i < total; i++) {
          nextBoxes[index + i] = chars[i]!
        }
        commit(nextBoxes)
        focusBox(Math.min(index + chars.length, total - 1))
        return
      }

      const nextBoxes = [...boxes]
      nextBoxes[index] = digits
      commit(nextBoxes)
      if (digits && index < total - 1) focusBox(index + 1)
    }

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return

      switch (event.key) {
        case 'Backspace': {
          if (!boxes[index] && index > 0) {
            event.preventDefault()
            const nextBoxes = [...boxes]
            nextBoxes[index - 1] = ''
            commit(nextBoxes)
            focusBox(index - 1)
          }
          break
        }
        case 'Delete': {
          event.preventDefault()
          // `boxes` (and every copy derived from it) is always exactly `total` entries long — see
          // `toBoxes` — so `i + 1` (bounded by `i < total - 1`) never reads past the end.
          const nextBoxes = [...boxes]
          for (let i = index; i < total - 1; i++) nextBoxes[i] = nextBoxes[i + 1]!
          nextBoxes[total - 1] = ''
          commit(nextBoxes)
          break
        }
        case 'ArrowLeft': {
          if (index > 0) {
            event.preventDefault()
            focusBox(index - 1)
          }
          break
        }
        case 'ArrowRight': {
          if (index < total - 1) {
            event.preventDefault()
            focusBox(index + 1)
          }
          break
        }
        default:
          break
      }
    }

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault()
      if (disabled) return
      const digits = onlyDigits(event.clipboardData.getData('text')).slice(0, total)
      if (!digits) return
      commit(toBoxes(digits, total))
      focusBox(Math.min(digits.length, total) - 1)
    }

    const renderBoxes = (start: number, count: number) =>
      Array.from({ length: count }, (_, i) => start + i).map((i) => (
        <OtpBox
          disabled={disabled}
          index={i}
          invalid={invalid}
          key={i}
          mask={mask}
          onChangeValue={(next) => handleChange(i, next)}
          onKeyDownBox={(event) => handleKeyDown(i, event)}
          onPasteBox={handlePaste}
          ref={(el) => {
            boxRefs.current[i] = el
          }}
          size={size}
          valid={valid}
          value={boxes[i] ?? ''}
        />
      ))

    let content: ReactNode
    if (groupSizes && groupSizes.length > 0) {
      let cursor = 0
      content = groupSizes.map((groupSize, groupIndex) => {
        const start = cursor
        cursor += groupSize
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={groupIndex}>
            {groupIndex > 0 && <span className="form-otp-separator">{separator}</span>}
            {inputGroup ? (
              <div className="input-group">{renderBoxes(start, groupSize)}</div>
            ) : (
              renderBoxes(start, groupSize)
            )}
          </Fragment>
        )
      })
    } else {
      content = renderBoxes(0, total)
    }

    const {
      describedBy,
      feedbackId,
      helpId,
      inputId: groupId,
      labelId,
      labelledBy
    } = useFormField({
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

    return renderFormField({
      children: (
        <div
          {...rest}
          aria-describedby={describedBy}
          aria-labelledby={labelledBy}
          className={classNames(
            'form-otp',
            { 'input-group': inputGroup && !(groupSizes && groupSizes.length > 0) },
            validationClassName(invalid, valid),
            className
          )}
          id={groupId}
          ref={forkedRef}
          role="group"
        >
          {content}
          {name && <input disabled={disabled} name={name} type="hidden" value={boxes.join('')} />}
        </div>
      ),
      help,
      ids: { feedback: feedbackId, help: helpId, label: labelId },
      invalid,
      invalidFeedback,
      label,
      valid,
      validFeedback
    })
  }
)

OtpInput.displayName = 'OtpInput'
