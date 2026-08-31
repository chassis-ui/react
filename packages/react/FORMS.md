# Form component system

`src/components/` holds every component, one folder per component (`components/<kebab-name>/<PascalName>.tsx`; tests live separately under `test/components/<kebab-name>/`, not colocated). Most folders there are unrelated to forms (accordion, card, modal, ...) and need no special knowledge beyond that convention. This doc is scoped to the **form component family**: `checkbox/`, `radio/`, `switch/`, `text-input/`, `textarea/`, `select/`, `range-input/`, `file-input/`, `color-input/`, `combobox/`, `datepicker/`, `chip-input/`, `otp-input/`, `form/`, `form-field/`, `floating-input/` — because they share two internal render-helper engines and a handful of non-obvious rules that are easy to violate by copy-pasting from the wrong sibling.

It lives here, at the package root, rather than inside `src/components/`, so it isn't picked up just by proximity when editing an unrelated component (accordion, card, modal, ...) — [`AGENTS.md`](AGENTS.md) points here explicitly for anyone touching the form family instead, the same way `README.md`/`LICENSE` already sit at this level.

If you're touching a form-related component and haven't read this file yet, read it first. If you're adding a brand-new form component, read [Adding a new form component](#adding-a-new-form-component) before writing any code.

## The two engines

There are **two** shared render helpers in this family. They look similar (both take an `input`/`children`, both know about `label`/`invalid`/`valid`) but they are not interchangeable, and neither is a generic "any form thing" abstraction — pick the one that matches what you're building.

### 1. `renderFormCheck` (`form/renderFormCheck.tsx`)

Used by: `checkbox/Checkbox.tsx`, `radio/Radio.tsx`.

Renders the **nested** `.form-check`/`.check-input` markup — everything lives inside a single `<label>` (or a bare `<span class="check-input">` when there's no label). This is the toggle-control shape: a checkbox/radio/switch always has its label _beside_ it, never a separate wrapper with the label _above_ the control. It also handles the `button` prop (button-style toggle variant) — nothing else in this family has that concept.

`Switch` does **not** use this helper — it inlines the same nested-label shape itself because a switch's `role="switch"` attribute placement didn't fit the shared function cleanly. If you touch `Switch`, keep its markup shape in sync with `renderFormCheck` by eye; there's no shared code to keep them honest.

`CheckboxGroup`/`RadioGroup` don't use this helper either. They render their own `<fieldset>`/`<legend>` directly and call `FormHelp`/`FormFeedback` themselves, wired through react-aria's own `useCheckboxGroup`/`useRadioGroup` — see [Group components are a third pattern](#group-components-are-a-third-pattern) below.

`Radio` intentionally has no `invalid`/`valid`/`invalidFeedback`/`validFeedback` props at the item level, unlike `Checkbox` (which shares this same engine and does have them) — a lone radio's validity isn't a meaningful concept on its own, it's a group-level one already carried by `RadioGroup`. Don't "fix" this asymmetry by adding those props to `Radio`.

### 2. `renderFormField` (`form-field/renderFormField.tsx`)

Used by: `text-input/TextInput.tsx`, `textarea/Textarea.tsx`, `select/Select.tsx`, `range-input/RangeInput.tsx`, `file-input/FileInput.tsx`, `color-input/ColorInput.tsx`, `combobox/Combobox.tsx`, `datepicker/DatePicker.tsx`, `chip-input/ChipInput.tsx`, `otp-input/OtpInput.tsx`.

Renders the **sibling** `.form-field` grid layout: `FormLabel`, then `children` (your control), then `FormHelp`, then `FormFeedback` — see [chassis-css's Form Field docs](https://chassis-ui.com/css/docs/forms/form-field). Unlike `renderFormCheck`, this returns **children bare** (no wrapper at all) when none of `label`/`help`/`validFeedback`/`invalidFeedback` are set, so every leaf stays a drop-in native-looking element until a consumer opts into the wrapping.

Every one of the 10 components above follows the exact same internal shape, via the shared `useFormField` hook (`hooks/useFormField.ts`):

```tsx
export const Whatever = forwardRef<HTMLElement, WhateverProps>(
  ({ /* destructure label, help, invalid, invalidFeedback, valid, validFeedback, id, ...rest */ }, ref) => {
    const { describedBy, feedbackId, helpId, inputId } = useFormField({
      ariaDescribedBy: rest['aria-describedby'],  // preserve anything the consumer passed directly
      help, id, invalid, invalidFeedback, valid, validFeedback
    })
    // omit `inputId` (or alias it, e.g. `inputId: groupId`) for group widgets — see below

    // ... build the actual control, wiring `aria-describedby={describedBy}` and
    // `aria-invalid={invalid || undefined}` onto the real focusable element ...

    return renderFormField({
      children: <the real control>,
      help, ids: { feedback: feedbackId, help: helpId, input: inputId },
      invalid, invalidFeedback, label, valid, validFeedback
    })
  }
)
```

`useFormField` generates every id with React's own `useId()`, not react-aria's — even for the react-aria-backed leaves (`TextInput`/`Textarea` via `useTextField`). This is deliberate: it's the one thing that's identical across all 10 components regardless of whether react-aria is involved. The hook returns `describedBy`/`labelledBy` already as `string | undefined` (never `''`), so call sites apply them directly (`aria-describedby={describedBy}`) with no `|| undefined` needed.

For the `role="group"` shape (`DatePicker`/`OtpInput`) _and_ for any react-aria-hook-backed single-input component (`TextInput`/`Textarea`/`Combobox`/`ChipInput`, see below), also pass `label` and `ariaLabelledBy: rest['aria-labelledby']` to get `labelId`/`labelledBy` back — see gotcha #4 for the one thing you still have to do by hand even with the hook, and gotcha #5 for why the single-input components need this too.

### `htmlFor` vs `aria-labelledby` — pick based on what you're wrapping

`renderFormField`'s `ids` bag has both an `input` slot (label gets `htmlFor={ids.input}`) and a `label` slot (label gets its own `id={ids.label}` instead, for a control to reference via `aria-labelledby`). Both can be set at once; use whichever fits:

- **One real focusable input, no react-aria hook** (`Select`, `RangeInput`, `FileInput`, `ColorInput`) → `ids.input` only, label uses `htmlFor`. A `<label for>` only works on an actual labelable element (input/select/textarea/button/...); this is the normal case, and there's no react-aria hook here to also feed.
- **One real focusable input, backed by a react-aria hook** (`TextInput`/`Textarea` via `useTextField`, `Combobox` via `useComboBox`, `ChipInput`'s ghost input via `useTextField`) → set **both**: `ids.input` (`htmlFor`, for the browser/AT) _and_ `ids.label` (`aria-labelledby`, for the hook). react-aria's own hooks run a dev-mode check for a missing accessible name (`useLabel`'s "If you do not provide a visible label..." warning) that only looks at the DOM node's own attributes — it has no way to see an external `<label for>` association, so `htmlFor` alone leaves it printing a false-positive warning on every render. Pass `label` and `ariaLabelledBy: rest['aria-labelledby']` into `useFormField` to get `labelId`/`labelledBy` back, thread `labelledBy` into the react-aria hook's own `aria-labelledby` (redundant with `htmlFor` at the DOM level, but that's fine — matching accessible names from two mechanisms is a no-op, not a conflict), and pass `ids.label` too so the id isn't dangling.
- **A `role="group"` wrapper with no single input to target** (`OtpInput`'s digit boxes, `DatePicker`'s segmented date field + calendar button) → `ids.label`, and thread it into the group's own `aria-labelledby` yourself (merged with any consumer-supplied `aria-labelledby`, same pattern as `describedBy` above). `htmlFor` pointing at a `<div role="group">` does nothing — screen readers only honor `for` on real labelable elements.

Getting this backwards is silent at runtime (no error, no test failure unless you assert the accessible name) — it just fails to associate the label. If you're not sure which one your component needs, check whether `screen.getByRole(..., { name: 'Your Label' })` finds it in a test; if it doesn't, you used the wrong slot.

### `FormField` (`form-field/FormField.tsx`) — the escape hatch, not the default

`FormField` is a **thin function wrapper around `renderFormField`** for the one case none of the 10 components above can serve: wrapping a control that has no field props of its own, or grouping more than one element under one label (e.g. an input plus a `PasswordStrength` meter as siblings). It has no `forwardRef`, no id generation of its own — the consumer supplies `ids` explicitly and is responsible for wiring `aria-describedby`/`aria-labelledby` onto their own child, because `FormField` never clones or introspects its children.

**Do not reach for `FormField` to wrap `TextInput`/`Select`/`Textarea`/`RangeInput`/`FileInput`/`ColorInput`/`Combobox`/`DatePicker`/`ChipInput`/`OtpInput`.** All 10 already do this internally — wrapping one in `FormField` produces a nested (and empty, since the inner one gets no `label`/`help` props) `.form-field` div. Pass `label`/`help`/`invalid`/`invalidFeedback`/`valid`/`validFeedback` straight onto the component.

### `FloatingInput` (`floating-input/FloatingInput.tsx`) — same escape-hatch shape, plus its own always-present label

`FloatingInput` follows `FormField`'s shape (a thin `renderFormField` call, no `forwardRef` id generation — the consumer supplies `ids` and puts the matching `id` on their own control), but it is not interchangeable with `FormField`: it always renders a `FormLabel` itself (`label` is required, not optional — chassis-css's floating-label CSS needs a `<label>` present to float, see `label:has(~ .form-input)` in `_floating-labels.scss`), and that label plus `children` are rendered as `.form-floating`'s direct children first, then the whole `.form-floating` div (not a bare `label`) is passed as `renderFormField`'s `children` — this is what makes it wrap in `.form-field` only when `help`/`invalidFeedback`/`validFeedback` are set, while still always rendering `.form-floating` around the label+control pair. Don't pass `label` to the wrapped `TextInput`/`Select`/`Textarea` itself — that would additionally wrap it in its own nested `.form-field` via that component's internal `renderFormField` call, which chassis-css's floating CSS doesn't expect (the label needs to be a direct sibling of the `.form-input` element, not one level deeper).

### Adorns — a conditional wrapper inside `renderFormField`'s `children`

`TextInput` and `Select` (so far the only two of the 10) also support `adornStart`/`adornEnd`, rendering chassis-css's [input help](https://chassis-ui.com/css/docs/forms/input-adorn) pattern — a `.form-input` wrapper `<div>` around a `.ghost-input`-classed `<input>`/`<select>` plus one or two `.input-adorn` adorns (see `InputAdorn`, `input-adorn/InputAdorn.tsx` — the component is named after what it is, `input-adorn`, but still applies chassis-css's own `.input-adorn` class since that's the class the compiled CSS actually targets). This is orthogonal to `renderFormField`'s own conditional wrapping (label/help/feedback): the adorn wrapper is built _inside_ what gets passed as `renderFormField`'s `children`, present only when `adornStart`/`adornEnd` is set — same shape `DatePicker`/`ChipInput` already use unconditionally for their own always-present trailing button/chip-list, just made conditional here since adorns are optional.

**`Select`'s wrapper additionally needs a click-proxy, which `TextInput` does not.** A bare `<select class="form-input">` fills its whole box, so clicking anywhere on it opens the native dropdown for free. Once wrapped, the `<select>` only occupies the flex space between its adorns — clicking an adorn or the wrapper's own padding no longer reaches the select at all. `Select` compensates with an `onClick` on the wrapper `<div>` that calls `.focus()` + `.showPicker()` on the select ref, skipped when the click landed directly on the select (already handled natively), on a nested actionable adorn (`<button>`/`<a>`, which owns its own click), or when the select can't render a picker at all (`disabled`, `multiple`, or `htmlSize > 1` — see `select.form-input[multiple]`/`[size]` in the compiled CSS, which drops the caret background entirely for those). `.form-caret` — the class that paints the dropdown-caret background chassis-css normally puts on `select.form-input` itself via a compound selector — has to move onto the wrapper for the same reason once the select becomes `.ghost-input` and stops matching `select.form-input`. If a future component needs this same "wrapper is bigger than the interactive element" adorn shape (e.g. a native picker-driving element other than text/select), reach for this click-proxy pattern rather than reinventing it.

**The non-obvious part: validation-state and layout classes land on different elements depending on whether adorns are present.** Compiled chassis-css has two separate selector families — `.form-input.is-invalid` (bare case) vs. `.form-input:has(.ghost-input.is-invalid)` (wrapped case) — so `is-invalid`/`is-valid` must move from the `.form-input` element onto the inner `<input>` once it becomes `.ghost-input`. `size`/`plainText`/the caller's `className`, by contrast, stay on the outermost rendered element either way (the bare `<input class="form-input">` when no adorns, the wrapper `<div class="form-input">` when there are) — chassis-css's sizing rules only ever key off `.form-input`, never `.ghost-input`. Get the split backwards and validation/sizing styling silently doesn't apply once a consumer adds an adorn.

## Group components are a third pattern

`CheckboxGroup`/`RadioGroup` predate `renderFormField` and intentionally don't use it. They:

- take `description`/`errorMessage` (not `help`/`invalidFeedback`/`validFeedback` — different names, same idea)
- always render the `<fieldset>`/`<legend>` wrapper unconditionally, never "bare children"
- get their ids from react-aria's own `useCheckboxGroup`/`useRadioGroup` (via `descriptionProps`/`errorMessageProps`), not from a manual `useId()` suffix scheme

Don't try to unify these with the `renderFormField` family — the props are named differently on purpose (a `CheckboxGroup` "description" is conceptually a fieldset-level description, not a single-control help text) and it would be a breaking rename for no real gain. If a future component needs the SAME grouped-fieldset shape, copy this pattern, not `renderFormField`.

## Naming and folder conventions

- One component (or a tightly-coupled family like a group + its item) per folder, named after the folder in kebab-case: `text-input/TextInput.tsx`, `range-input/RangeInput.tsx`.
- No `Form*` prefix except the handful of genuinely shared, generic pieces that live in `form/`: `Form`, `FormLabel`, `FormHelp`, `FormFeedback`, plus the `renderFormCheck` helper itself (not a component, but colocated there since it's `FormLabel`'s only non-leaf consumer). Everything else is named after what it _is_ (`Select`, not `FormSelect`; `Checkbox`, not `FormCheck`).
- `className` builder ordering — see [`CONVENTIONS.md`](CONVENTIONS.md#classname-builder-ordering).
- Every native-input leaf keeps the underlying element genuinely native (`<input>`, `<select>`, `<textarea>`) — no custom widget replaces a form control chassis-css itself only ever targets via a native attribute selector (`select.form-input`, `.form-input[type="file"]`, `.form-input[type="color"]`). Don't introduce a react-aria hook for `Select`/`RangeInput`/`FileInput`/`ColorInput`; there isn't one that preserves the native element (`useSelect`/`useSlider` render fully custom markup chassis-css doesn't style).

## Gotchas found the hard way

These are real bugs hit while building this system — re-reading them before wiring a new react-aria-backed component will save you a failing-test round-trip:

1. **A hook's own returned props can silently clobber your explicit override if spread after it.** `useComboBox`/`useTextField`'s returned `inputProps` objects unconditionally include keys like `aria-describedby: undefined` even when you never asked for one. If you spread that object _after_ your own `aria-describedby={describedBy}`, the hook's `undefined` wins and your override vanishes — with no error, just a missing attribute. Always spread the hook's props **first**, then your manual overrides last: `<input {...hookProps} aria-describedby={...} aria-invalid={...} />`.
2. **A hardcoded fallback `aria-label` beats a real `<label>`.** `aria-label` always wins over label-association (`for`/`aria-labelledby`) when computing an accessible name. If a component has an internal fallback label (`ChipInput`'s `'Add value'` when neither `aria-label` nor `aria-labelledby` is set), it must also stop applying that fallback once the new `label` prop is present — otherwise the rendered `<FormLabel>` is visually there but the control's accessible name silently stays the fallback text.
3. **Not every react-aria hook here supports `isInvalid`/`description`/`errorMessage`.** `useTextField` and `useDatePicker` do (they extend `Validation`/`HelpTextProps`); `useComboBox` does not. Check the hook's own TypeScript options before assuming you can pass validation props straight through — if it's not accepted, wire `aria-describedby`/`aria-invalid` onto the real DOM node yourself (see gotcha #1 for the spread-order trap that comes with doing this manually).
4. **A hook-computed `aria-labelledby`/`aria-describedby` can get silently reverted to the caller's raw prop if it's only inside a `mergeProps(hookProps, rest)` spread with no explicit override after it.** react-aria's own `mergeProps` lets the _later_ argument win per key (`result[key] = b !== undefined ? b : a`), so spreading `rest` after `hookProps` means the caller's raw, un-merged `aria-labelledby` (still sitting in `rest` because it wasn't destructured out) overwrites the merged version — even though `useFormField`'s `labelledBy` was deliberately built to combine `ids.label` with that same raw value. `DatePicker` hit exactly this: it feeds `useFormField`'s `labelledBy` into `useDatePicker`, but only re-applied `aria-describedby` (not `aria-labelledby`) as an explicit prop after `{...mergeProps(groupProps, rest)}` — so a consumer passing `label` _and_ `aria-labelledby` together got a group whose accessible name silently dropped the visible label entirely. Fixed by re-applying `aria-labelledby={labelledBy}` after the spread, same as `aria-describedby` already was. Any new group-shaped component that both (a) uses `useFormField`'s merged `labelledBy`/`describedBy` and (b) spreads a react-aria hook's props via `mergeProps(hookProps, rest)`, must re-apply every merged aria-* value as an explicit prop after that spread — not just the one you happened to test.
5. **A react-aria hook's own "no accessible label" dev warning doesn't know about an external `<label for>`.** `useTextField`/`useComboBox` (via `useLabel` internally) check the DOM node's own `aria-label`/`aria-labelledby` attributes to decide whether to `console.warn`; they have no visibility into a `<FormLabel htmlFor={ids.input}>` rendered by `renderFormField` elsewhere in the tree. `TextInput`, `Textarea`, `Combobox`, and `ChipInput` all hit this: rendering any of them with only `label` (no `aria-label`) passed react-aria's own dev check but was still flagged, because the hook was only ever told about `rest['aria-label']`/`rest['aria-labelledby']`, never about `label`. Fixed the same way as the group shape (gotcha above) — feed `label` into `useFormField`, thread the resulting `labelledBy` into the hook's own `aria-labelledby`, and pass `ids.label` too. If you add a new single-input component wrapping a react-aria text/combo-style hook, do this from the start rather than waiting for the warning to show up in test output (it's easy to miss - some CI/reporter configurations only show `stderr` console output for a passing test when `--reporter=default` is passed explicitly).

## Adding a new form component

1. Decide which of the two engines it needs (a toggle control → `renderFormCheck`; anything else with a label/help/validation → `renderFormField`). If it's neither (a fieldset-style group), model it on `CheckboxGroup`/`RadioGroup` instead of inventing a fourth pattern.
2. New folder: `components/<kebab-name>/<PascalName>.tsx`, plus `test/components/<kebab-name>/<PascalName>.spec.tsx` (+ snapshot).
3. If it wraps a native element with a real react-aria hook (text-like input) — check whether that hook already supports `isInvalid`/`description`/`errorMessage` before writing your own `aria-describedby` plumbing; if it does, prefer it, but keep using `useFormField` for the `ids`/describedBy shape, identical to the rest of the family for consistency (see gotcha #3).
4. If it's a native element with no applicable hook (`Select`/`RangeInput`/`FileInput`/`ColorInput` are the precedent), use the `useFormField` + `renderFormField` template above verbatim.
5. Export from `packages/react/src/index.ts` (both the import and the `export { }` block — see existing entries for placement).
6. Regenerate API docs (`pnpm react:generate` from repo root) and add a
   `packages/site/content/components/<kebab-name>.mdx` page + a `packages/site/data/sidebar.yml`
   entry under the `Form Controls` or `Form Layout` group.
