# Theming

`@chassis-ui/react` owns almost no visual styling of its own. Every component applies
`@chassis-ui/css` class names via `classnames` — the same classes a hand-written HTML page using
chassis-css directly would use — so re-theming this library is, for nearly every component, really
about re-theming `@chassis-ui/css`/`@chassis-ui/tokens`, not this package. The one exception is the
calendar/datepicker family (see "Component-scoped CSS" below).

This doc is about what a consuming app can safely override and expect to keep working across
upgrades, versus what's an internal implementation detail of chassis-css that happens to be
reachable but isn't part of any stability contract.

## The supported override surface: `--cx-*` custom properties at `:root`

`@chassis-ui/tokens` compiles a brand's design tokens into a large set of CSS custom properties
(colors, spacing, radii, typography, ...) that `@chassis-ui/css`'s compiled stylesheet declares at
`:root` — roughly 800 of them as of chassis-css 0.3.5, covering base colors, the eleven semantic
context colors (`primary`, `success`, `danger`, ...) and their hover/active/subtle/contrast
variants, spacing scale, border radii, and typography. These are the supported theming surface, in
two ways:

- **Build-time**: swap which `@chassis-ui/tokens` brand file gets compiled ahead of
  `@chassis-ui/css`'s own Sass (see chassis-css's own README — `@import
'@chassis-ui/tokens/dist/web/<app>/<brand>.scss'` before `@import '@chassis-ui/css/scss/chassis.scss'`).
  This is a chassis-css-level build step, not something `@chassis-ui/react` has any part in.
- **Runtime**: because they're plain CSS custom properties, any of them can be overridden directly
  — `:root { --cx-primary: #... }` in a consuming app's own stylesheet, or set inline on a
  scoping ancestor to theme a subtree differently.

Light/dark mode works the same way: chassis-css re-declares its `:root`-level tokens under
`[data-cx-theme="light"]`/`[data-cx-theme="dark"]` attribute selectors. Setting that attribute
(typically on `<html>`) is how a consuming app switches modes — again, entirely a chassis-css
concern; `@chassis-ui/react` doesn't read or set this attribute itself anywhere.

The authoritative, up-to-date list of tokens lives in chassis-css's own docs (Design Tokens /
Core Concepts at chassis-ui.com), not duplicated here — it's large, actively maintained, and would
go stale immediately if copied into this file.

## Not part of the supported surface

These are all real, inspectable things a consumer _could_ target, but none of them are a stability
contract — they can change shape without a major-version signal from this package, because they're
either chassis-css's own internal implementation or an internal wire protocol between the two
packages:

- **`--cx-*` custom properties declared only inside a component-class selector, not at `:root`.**
  Chassis-css's "context re-declaration" system (see chassis-css's README) re-declares many
  `--cx-*` variable _names_ inside component-scoped selector blocks (e.g. inside `.btn`, `.card`)
  to implement its context-color system — the same custom-property naming convention chassis-css
  uses for its public `:root` tokens is also its own internal implementation vocabulary. A
  component-scoped re-declaration isn't itself an override point; overriding the `:root` token it
  derives from is.
- **`data-cx-*` attributes that aren't `data-cx-theme`** — `data-cx-placement`, `data-cx-inline`,
  `data-cx-target`, `data-cx-strength`, etc. These are a wire protocol between
  `@chassis-ui/react`'s components and `@chassis-ui/css`'s attribute selectors (see
  `CONVENTIONS.md`'s "What isn't caught by lint" note), not a theming hook — don't set or rely on
  their values from outside this package.
- **Internal `cx-*`/plain class name strings the calendar/datepicker family's own `.scss` files use
  for their own layout** (e.g. `.datepicker-field`, `.datepicker-segment`) — implementation detail
  of those four components, not a documented public class API. Style through the props those
  components expose (`className`, `size`, ...), not by targeting their internal markup.
- **Four properties genuinely coupled to chassis-css's current internal structure, not its public
  token surface**: `--cx-day-disabled-fg-color`, `--cx-day-range-bg-color`,
  `--cx-day-range-fg-color` (used in `Calendar.scss`/`RangeCalendar.scss`) and
  `--cx-form-idle-fg-inactive` (`DatePicker.scss`) are only ever defined inside chassis-css's own
  `.datepicker`/`.form-input` selector blocks, with no `:root` fallback — unlike every other
  `--cx-*` reference these four files make. Each currently resolves to a stable-looking global
  default in chassis-css's compiled source, but that's chassis-css's current internal structure,
  not a promise. See the comment at the top of `Calendar.scss` for the full reasoning and how to
  re-check this if chassis-css's internals change.

## Component-scoped CSS

The calendar/datepicker family (`Calendar`, `RangeCalendar`, `DatePicker`, `DateRangePicker`) plus
`Table` (its sort indicator and selection-checkbox column — see `Table.css`'s own header comment)
and `Notification` (its `.showing` mid-transition opacity state — see `Notification.scss`'s own
header comment) are the only places in this package with component-scoped CSS/Sass — chassis-css
has no visual equivalent for a calendar grid/segmented date field, those two `Table` pieces, or
`Notification`'s Toast-parity fade-in/out, so there was nothing to reuse. These files already build
on the supported `--cx-*` token surface above wherever chassis-css has one (documented in each
file's own header comment, which also names the four exceptions above) — treat that as the
reference implementation for what "component-scoped CSS built on the token system" looks like if a
future component needs the same treatment. Before adding a new one, read `../chassis-css/scss/`
for an existing partial that already covers the need — don't reimplement first and tokenize later.
`Calendar.scss`/`DatePicker.scss`'s own header comments are the reference example for how this was
done for the calendar/datepicker family.

Every other component ships zero CSS of its own — there's nothing in this package for a consuming
app to override beyond the chassis-css classes it applies, which is exactly the point: theming
those goes entirely through the `--cx-*` surface described above.

### Consuming this package's own emitted stylesheet

Each of these six files' CSS/Sass side-effect imports (`import './Calendar.scss'`, `import
'./Table.css'`, `import './Notification.scss'`, ...) is compiled by tsdown's build into a single
real `dist/style.css` file, rather than injected into the page via a JS-created `<style>` tag at
import time. A consuming app must import it explicitly — it isn't bundled into `dist/index.js` and
won't reach the page for free:

```ts
import '@chassis-ui/react/style.css'
```

Import it once, anywhere in the app's own global/root stylesheet entry point (alongside the
`@chassis-ui/css` stylesheet import — see `packages/site/content/getting-started/introduction.mdx`
for the pattern this repo's own docs site follows). Skipping this import doesn't error —
`Calendar`, `DatePicker`, and `Table`'s sort/selection UI will simply render unstyled for those
specific pieces, and `Notification` will snap in/out at full opacity instead of fading, since every
other component's chassis-css-only styling is unaffected.
