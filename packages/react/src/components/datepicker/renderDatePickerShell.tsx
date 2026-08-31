import React, { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import classNames from 'classnames'
import { FocusScope } from 'react-aria'

import { validationClassName } from '../../utils/validationClassName'

export interface RenderDatePickerShellOptions {
  /**
   * The fully-built calendar element (`Calendar`/`RangeCalendar`, with its own dialog role/ref
   * already applied) — only ever mounted while `isOpen`, inside a `FocusScope`.
   */
  calendar: ReactNode
  className?: string
  /**
   * The `ClearButton` element, or `null`/`undefined` when there's nothing to clear.
   */
  clearButton?: ReactNode
  disabled?: boolean
  /**
   * The field itself — a single segmented `DateField`, a read-only `MultiDateField`, or a pair
   * of `DateField`s either side of a separator.
   */
  field: ReactNode
  /**
   * className for the wrapper directly around `field` — differs slightly by variant
   * (`DateRangePicker`'s two side-by-side fields need `d-flex`, the single-field variants don't).
   */
  fieldClassName: string
  /**
   * Already-merged props (react-aria's `groupProps`/`mergeProps(rest)`, plus
   * `aria-describedby`/`aria-labelledby` and any variant-specific ARIA attributes) for the
   * `.form-input` wrapper — assembling this is the caller's job since react-aria only returns a
   * `groupProps` shape for the single-select hooks, not the manually-assembled multi-select case.
   */
  groupProps: HTMLAttributes<HTMLDivElement>
  groupRef: Ref<HTMLDivElement>
  invalid?: boolean
  isOpen: boolean
  overlayDismissProps: HTMLAttributes<HTMLElement>
  overlayRef: Ref<HTMLDivElement>
  overlayStyle?: CSSProperties
  placementAttr?: string
  size?: 'small' | 'large'
  toggleButton: ReactNode
  valid?: boolean
}

// Shared `.form-input` adorn-wrapper + popover-overlay shell for `DatePicker`'s two internal
// variants (single/multiple selection) and `DateRangePicker` — otherwise duplicated near-verbatim
// three times. What's left in each caller is only the genuinely variant-specific pieces: which
// field(s) render inside the wrapper, which calendar (`Calendar`/`RangeCalendar`, single- vs.
// range-typed props) renders inside the overlay, and how each variant's own `groupProps`/hidden
// inputs get built.
export const renderDatePickerShell = ({
  calendar,
  className,
  clearButton,
  disabled,
  field,
  fieldClassName,
  groupProps,
  groupRef,
  invalid,
  isOpen,
  overlayDismissProps,
  overlayRef,
  overlayStyle,
  placementAttr,
  size,
  toggleButton,
  valid
}: RenderDatePickerShellOptions): ReactNode => (
  <>
    <div
      {...groupProps}
      className={classNames(
        'form-input',
        size,
        { disabled },
        validationClassName(invalid, valid),
        className
      )}
      ref={groupRef}
    >
      <div className={fieldClassName}>{field}</div>
      {clearButton}
      {toggleButton}
    </div>
    <div
      className="datepicker"
      data-cx-placement={placementAttr}
      hidden={!isOpen}
      ref={overlayRef}
      {...overlayDismissProps}
      style={overlayStyle}
    >
      {isOpen && (
        <FocusScope contain restoreFocus>
          {calendar}
        </FocusScope>
      )}
    </div>
  </>
)
