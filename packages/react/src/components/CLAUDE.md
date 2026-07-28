# Form component system

This directory holds every `Cx*` component, one folder per component (`components/<kebab-name>/Cx<PascalName>.tsx` + `__tests__/`). Most folders here are unrelated to forms (accordion, card, modal, ...) and need no special knowledge beyond that convention. This doc is scoped to the **form component family** — the folders listed in the inventory below — because they share two internal render-helper engines and a handful of non-obvious rules that are easy to violate by copy-pasting from the wrong sibling.

If you're touching a form-related component and haven't read this file yet, read it first. If you're adding a brand-new form component, read [Adding a new form component](#adding-a-new-form-component) before writing any code.

## The two engines

There are **two** shared render helpers in this family. They look similar (both take an `input`/`children`, both know about `label`/`invalid`/`valid`) but they are not interchangeable, and neither is a generic "any form thing" abstraction — pick the one that matches what you're building.

### 1. `renderFormCheckControl` (`components/formCheckRender.tsx`)

Used by: `checkbox/CxCheckbox.tsx`, `radio/CxRadio.tsx`.

Renders the **nested** `.form-check`/`.check-input` markup — everything lives inside a single `<label>` (or a bare `<span class="check-input">` when there's no label). This is the toggle-control shape: a checkbox/radio/switch always has its label *beside* it, never a separate wrapper with the label *above* the control. It also handles the `button` prop (button-style toggle variant) — nothing else in this family has that concept.

`CxSwitch` does **not** use this helper — it inlines the same nested-label shape itself because a switch's `role="switch"` attribute placement didn't fit the shared function cleanly. If you touch `CxSwitch`, keep its markup shape in sync with `renderFormCheckControl` by eye; there's no shared code to keep them honest.

`CxCheckboxGroup`/`CxRadioGroup` don't use this helper either. They render their own `<fieldset>`/`<legend>` directly and call `CxFormHelp`/`CxFormFeedback` themselves, wired through react-aria's own `useCheckboxGroup`/`useRadioGroup` — see [Group components are a third pattern](#group-components-are-a-third-pattern) below.

### 2. `renderFormField` (`form-field/renderFormField.tsx`)

Used by: `text-input/CxTextInput.tsx`, `textarea/CxTextarea.tsx`, `select/CxSelect.tsx`, `range-input/CxRangeInput.tsx`, `file-input/CxFileInput.tsx`, `color-input/CxColorInput.tsx`, `combobox/CxCombobox.tsx`, `datepicker/CxDatePicker.tsx`, `chip-input/CxChipInput.tsx`, `otp-input/CxOtpInput.tsx`.

Renders the **sibling** `.form-field` grid layout: `CxFormLabel`, then `children` (your control), then `CxFormHelp`, then `CxFormFeedback` — see [chassis-css's Form Field docs](https://chassis-ui.com/css/docs/forms/form-field). Unlike `renderFormCheckControl`, this returns **children bare** (no wrapper at all) when none of `label`/`help`/`validFeedback`/`invalidFeedback` are set, so every leaf stays a drop-in native-looking element until a consumer opts into the wrapping.

Every one of the 10 components above follows the exact same internal shape:

```tsx
export const CxWhatever = forwardRef<HTMLElement, CxWhateverProps>(
  ({ /* destructure label, help, invalid, invalidFeedback, valid, validFeedback, id, ...rest */ }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId          // or omit `input` entirely for group widgets, see below
    const helpId = `${generatedId}-help`
    const feedbackId = `${generatedId}-feedback`

    const showInvalidFeedback = invalid && invalidFeedback
    const showValidFeedback = valid && validFeedback
    const describedBy = [
      help && helpId,
      (showInvalidFeedback || showValidFeedback) && feedbackId,
      rest['aria-describedby']              // preserve anything the consumer passed directly
    ].filter(Boolean).join(' ')

    // ... build the actual control, wiring `aria-describedby={describedBy || undefined}`
    // and `aria-invalid={invalid || undefined}` onto the real focusable element ...

    return renderFormField({
      children: <the real control>,
      help, ids: { feedback: feedbackId, help: helpId, input: inputId },
      invalid, invalidFeedback, label, valid, validFeedback
    })
  }
)
```

Every id is generated with React's own `useId()`, not react-aria's — even for the react-aria-backed leaves (`CxTextInput`/`CxTextarea` via `useTextField`). This is deliberate: it's the one thing that's identical across all 10 components regardless of whether react-aria is involved, so the pattern above can be copy-pasted verbatim into a brand-new component.

### `htmlFor` vs `aria-labelledby` — pick based on what you're wrapping

`renderFormField`'s `ids` bag has both an `input` slot (label gets `htmlFor={ids.input}`) and a `label` slot (label gets its own `id={ids.label}` instead, for a control to reference via `aria-labelledby`). Both can be set at once; use whichever fits:

- **One real focusable input** (`CxTextInput`, `CxSelect`, `CxTextarea`, `CxRangeInput`, `CxFileInput`, `CxColorInput`, `CxCombobox`, `CxChipInput`) → `ids.input`, label uses `htmlFor`. A `<label for>` only works on an actual labelable element (input/select/textarea/button/...); this is the normal case.
- **A `role="group"` wrapper with no single input to target** (`CxOtpInput`'s digit boxes, `CxDatePicker`'s segmented date field + calendar button) → `ids.label`, and thread it into the group's own `aria-labelledby` yourself (merged with any consumer-supplied `aria-labelledby`, same pattern as `describedBy` above). `htmlFor` pointing at a `<div role="group">` does nothing — screen readers only honor `for` on real labelable elements.

Getting this backwards is silent at runtime (no error, no test failure unless you assert the accessible name) — it just fails to associate the label. If you're not sure which one your component needs, check whether `screen.getByRole(..., { name: 'Your Label' })` finds it in a test; if it doesn't, you used the wrong slot.

### `CxFormField` (`form-field/CxFormField.tsx`) — the escape hatch, not the default

`CxFormField` is a **thin function wrapper around `renderFormField`** for the one case none of the 10 components above can serve: wrapping a control that has no field props of its own, or grouping more than one element under one label (e.g. an input plus a `CxPasswordStrength` meter as siblings). It has no `forwardRef`, no id generation of its own — the consumer supplies `ids` explicitly and is responsible for wiring `aria-describedby`/`aria-labelledby` onto their own child, because `CxFormField` never clones or introspects its children.

**Do not reach for `CxFormField` to wrap `CxTextInput`/`CxSelect`/`CxTextarea`/`CxRangeInput`/`CxFileInput`/`CxColorInput`/`CxCombobox`/`CxDatePicker`/`CxChipInput`/`CxOtpInput`.** All 10 already do this internally — wrapping one in `CxFormField` produces a nested (and empty, since the inner one gets no `label`/`help` props) `.form-field` div. Pass `label`/`help`/`invalid`/`invalidFeedback`/`valid`/`validFeedback` straight onto the component.

## Group components are a third pattern

`CxCheckboxGroup`/`CxRadioGroup` predate `renderFormField` and intentionally don't use it. They:
- take `description`/`errorMessage` (not `help`/`invalidFeedback`/`validFeedback` — different names, same idea)
- always render the `<fieldset>`/`<legend>` wrapper unconditionally, never "bare children"
- get their ids from react-aria's own `useCheckboxGroup`/`useRadioGroup` (via `descriptionProps`/`errorMessageProps`), not from a manual `useId()` suffix scheme

Don't try to unify these with the `renderFormField` family — the props are named differently on purpose (a `CxCheckboxGroup` "description" is conceptually a fieldset-level description, not a single-control help text) and it would be a breaking rename for no real gain. If a future component needs the SAME grouped-fieldset shape, copy this pattern, not `renderFormField`.

## Naming and folder conventions

- One component (or a tightly-coupled family like a group + its item) per folder, named after the folder in kebab-case: `text-input/CxTextInput.tsx`, `range-input/CxRangeInput.tsx`.
- No `CxForm*` prefix except the handful of genuinely shared, generic pieces that live in `form/`: `CxForm`, `CxFormLabel`, `CxFormHelp`, `CxFormFeedback`. Everything else is named after what it *is* (`CxSelect`, not `CxFormSelect`; `CxCheckbox`, not `CxFormCheck`).
- `className` builders always list the chassis-css base class first, then size, then `is-invalid`/`is-valid`, then the caller's `className` last (so caller overrides win). Match this order in any new component — chassis-css and existing snapshot tests both assume it.
- Every native-input leaf keeps the underlying element genuinely native (`<input>`, `<select>`, `<textarea>`) — no custom widget replaces a form control chassis-css itself only ever targets via a native attribute selector (`select.form-input`, `.form-input[type="file"]`, `.form-input[type="color"]`). Don't introduce a react-aria hook for `CxSelect`/`CxRangeInput`/`CxFileInput`/`CxColorInput`; there isn't one that preserves the native element (`useSelect`/`useSlider` render fully custom markup chassis-css doesn't style).

## Gotchas found the hard way

These are real bugs hit while building this system — re-reading them before wiring a new react-aria-backed component will save you a failing-test round-trip:

1. **A hook's own returned props can silently clobber your explicit override if spread after it.** `useComboBox`/`useTextField`'s returned `inputProps` objects unconditionally include keys like `aria-describedby: undefined` even when you never asked for one. If you spread that object *after* your own `aria-describedby={describedBy}`, the hook's `undefined` wins and your override vanishes — with no error, just a missing attribute. Always spread the hook's props **first**, then your manual overrides last: `<input {...hookProps} aria-describedby={...} aria-invalid={...} />`.
2. **A hardcoded fallback `aria-label` beats a real `<label>`.** `aria-label` always wins over label-association (`for`/`aria-labelledby`) when computing an accessible name. If a component has an internal fallback label (`CxChipInput`'s `'Add value'` when neither `aria-label` nor `aria-labelledby` is set), it must also stop applying that fallback once the new `label` prop is present — otherwise the rendered `<CxFormLabel>` is visually there but the control's accessible name silently stays the fallback text.
3. **Not every react-aria hook here supports `isInvalid`/`description`/`errorMessage`.** `useTextField` and `useDatePicker` do (they extend `Validation`/`HelpTextProps`); `useComboBox` does not. Check the hook's own TypeScript options before assuming you can pass validation props straight through — if it's not accepted, wire `aria-describedby`/`aria-invalid` onto the real DOM node yourself (see gotcha #1 for the spread-order trap that comes with doing this manually).

## Adding a new form component

1. Decide which of the two engines it needs (a toggle control → `renderFormCheckControl`; anything else with a label/help/validation → `renderFormField`). If it's neither (a fieldset-style group), model it on `CxCheckboxGroup`/`CxRadioGroup` instead of inventing a fourth pattern.
2. New folder: `components/<kebab-name>/Cx<PascalName>.tsx`, plus `__tests__/Cx<PascalName>.spec.tsx` (+ snapshot).
3. If it wraps a native element with a real react-aria hook (text-like input) — check whether that hook already supports `isInvalid`/`description`/`errorMessage` before writing your own `aria-describedby` plumbing; if it does, prefer it, but keep the `ids`/`useId()` shape identical to the rest of the family for consistency (see gotcha #3).
4. If it's a native element with no applicable hook (`CxSelect`/`CxRangeInput`/`CxFileInput`/`CxColorInput` are the precedent), use the manual `useId()` + `renderFormField` template above verbatim.
5. Export from `packages/react/src/index.ts` (both the import and the `export { }` block — see existing entries for placement).
6. Regenerate API docs (`pnpm api:generate` from repo root) and add a `packages/site/content/forms/<kebab-name>.mdx` page + a `packages/site/data/sidebar.yml` entry under the `Forms` group.
