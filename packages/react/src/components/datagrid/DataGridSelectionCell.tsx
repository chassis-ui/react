import React, { useRef } from 'react'
import { AriaCheckboxProps, useCheckbox } from 'react-aria'
import { useToggleState } from 'react-stately'
import { CheckboxContext, CheckboxProps, useSlottedContext } from 'react-aria-components'

export interface DataGridSelectionCellProps {
  /**
   * A string of all className you want applied to the checkbox, replacing the default
   * `check-input`.
   */
  className?: string
}

/**
 * Reads the selection checkbox props react-aria-components' own `Row`/`TableHeader` publish on
 * `CheckboxContext`'s `selection` slot — the same ones its `<Checkbox slot="selection">` would
 * consume, already carrying the localized label, the row-header `aria-labelledby`, and the
 * selected/disabled/indeterminate state.
 *
 * Reading them off that context (rather than calling react-aria's `useTableSelectionCheckbox`/
 * `useTableSelectAllCheckbox` against `TableStateContext` ourselves, as this file used to) is what
 * keeps this working when more than one copy of `react-aria` is installed. Those hooks resolve the
 * grid's id through a module-scoped `WeakMap` that only `useTable` populates, in whichever copy
 * ran it — always the copy bundled inside `react-aria-components` here, since its `Table` is what
 * calls `useTable`. `react-aria-components` pins `react-aria` to an exact version, so a consumer
 * whose own `react-aria` resolves anywhere else in our `^` range gets a second copy and the lookup
 * throws `Error: Unknown grid` on every selection cell. Letting react-aria-components compute the
 * props in its own copy sidesteps that entirely, and drops the duplicated `rowKey` this component
 * used to need — the context is already scoped to the row it's rendered in, so a `rowKey` that
 * disagreed with the surrounding `DataGridRow` can no longer silently toggle a different row.
 */
const useSelectionCheckboxProps = (component: string): AriaCheckboxProps => {
  const props = useSlottedContext(CheckboxContext, 'selection') as CheckboxProps | null | undefined
  if (!props) {
    throw new Error(`${component} must be rendered inside a DataGrid with selection enabled.`)
  }
  return props as AriaCheckboxProps
}

/**
 * Selection checkbox for one `DataGrid` row — place inside a `DataGridCell`.
 *
 * react-aria-components' own `Checkbox` always visually hides its native `<input>` behind a custom
 * indicator the caller must supply. This renders a plain native `<input className="check-input">`
 * instead, wired to the same state, so it picks up chassis-css's existing checkbox styling for
 * free with no new CSS of its own.
 */
export const DataGridSelectionCell = ({ className }: DataGridSelectionCellProps) => {
  const checkboxProps = useSelectionCheckboxProps('DataGridSelectionCell')
  return <DataGridCheckboxInput checkboxProps={checkboxProps} className={className} />
}

/**
 * "Select all" checkbox for `DataGrid`'s header row — place inside a `DataGridColumn`. See
 * `DataGridSelectionCell` for why this bypasses react-aria-components' own `Checkbox`.
 */
export const DataGridSelectAllCell = ({ className }: DataGridSelectionCellProps) => {
  const checkboxProps = useSelectionCheckboxProps('DataGridSelectAllCell')
  return <DataGridCheckboxInput checkboxProps={checkboxProps} className={className} />
}

const DataGridCheckboxInput = ({
  checkboxProps,
  className
}: {
  checkboxProps: AriaCheckboxProps
  className?: string
}) => {
  const toggleState = useToggleState(checkboxProps)
  const ref = useRef<HTMLInputElement>(null)
  const { inputProps } = useCheckbox(checkboxProps, toggleState, ref)

  return <input {...inputProps} className={className ?? 'check-input'} ref={ref} />
}
