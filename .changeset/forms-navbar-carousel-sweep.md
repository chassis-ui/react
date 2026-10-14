---
'@chassis-ui/react': minor
---

Fixes to form fields, `Navbar`, `Carousel` and a few small components.

- `Autocomplete`: the search field is a query only. After a selection it held the option's text when the list opened again, what was typed went after it so nothing matched, and emptying it cleared the selection. It is now empty each time the list opens, and the selection changes only when an option is chosen.
- `Autocomplete`: `value={null}` is a controlled empty selection, so a parent can clear the toggle. It was read as no `value`, and the selection went uncontrolled.
- Breaking: a single `Select` with a `placeholder` and no `value`, `defaultValue` or `selected` option starts on the placeholder, and its value is `''`. The browser showed the first enabled option, which was the value, and a `required` select passed validation with nothing chosen. Give `defaultValue` for a select that should start on an option.
- `Select`: an option of `options` with a `label`, no `value` and `selected: true` is selected. It renders with its label as its value, and the default was looked for under an empty value.
- `OtpInput`: a form reset puts the code back once, to `defaultValue` or empty, with one `onChange`. Each box reset itself against the same code, which left "1234" as "123" and called `onChange` four times.
- `OtpInput`: focus on a box past the first empty one moves to that box, where the next digit goes. A digit typed in the third box of `1 _ _ _` landed in the second.
- `ChipInput` and `Combobox`: a required field that held a submit back stays marked invalid while what is typed isn't a value, and the mark goes with the chip or the option that satisfies it. The first character typed cleared the mark, and the chip that satisfied a `ChipInput` left it.
- `ChipInput`: at `maxChips`, Enter and the separator leave the text they can't add in the input, as a paste does. They cleared it.
- `TimeField`: a required field takes focus after a submit it held back once a `label` or `help` was given later. Focus went nowhere.
- `RangeCalendar` and `DateRangePicker`: a preset kept inside `minValue`/`maxValue`, or given in reverse, shows as the selected preset once chosen.
- `Switch` with `type="radio"`, `isSelected` and no `onChange` no longer logs React's warning about a `checked` input with no handler.
- Breaking: `Navbar`'s `container` renders `container` beside its variant, `container fluid` or `container xl`, which `@chassis-ui/css` styles. It rendered `container-fluid` and `container-xl`, which have no rule, so the wrapper had no width and wasn't laid out as the navbar's row. CSS of your own written for those class names needs the new ones.
- `Carousel`:
  - With fewer slides than the active index needs, the last slide there is becomes the active one, which a controlled carousel asks for through `onSlide`. No slide was active, Next was disabled and Prev did nothing under `ends="stop"`.
  - A controlled carousel looping from its last slide to its first fires `onSlid` once the loop has arrived. It fired as the loop began.
  - A slide's own `aria-label` is kept. The position ("1 of 3") was written over it.
  - Unmounting during a loop stops its animation.
- `Link`: an `aria-current` given beside `active` is kept. `active` wrote `"page"` over it, as over a step's `"step"`.
- `BreadcrumbItem` with `href=""` renders a link, to the current document.
- `Pagination` with `pages={0}` renders its Previous and Next controls, disabled, and no pages. It rendered an empty navigation landmark.
- `Button` and `CloseButton` pass a `type` they are given to a component reference as `component`. It was dropped.
