## Building with Chassis

Chassis is a **CSS-framework-backed** design system: `@chassis-ui/react` supplies the
components, and `@chassis-ui/css` supplies a full utility-class layer plus ~1330 `--cx-*`
custom properties. Use library components for controls, and Chassis utility classes for
your own layout and spacing. Do not invent class names, and do not write ad-hoc CSS when
a utility exists.

### Theme root — required

Every token is declared on `:root` with `color-scheme: light dark` and `light-dark()`
values, so **with no theme attribute in the tree the UI follows the viewer's OS colour
preference**. Pin it explicitly:

```jsx
const { ChassisThemeRoot, Button } = window.ChassisReact;
<ChassisThemeRoot theme="light">{/* your app */}</ChassisThemeRoot>
```

`ChassisThemeRoot` just renders `<div data-cx-theme="light">`. Setting
`data-cx-theme="light"` or `"dark"` on your own root element is equivalent, and is what a
real Chassis app does. `color-scheme` inherits, so one attribute themes the whole subtree.

### The utility vocabulary

Scales are **named, not numeric** — `p-3`, `gap-2`, `m-4` do not exist. The scale is
`3xsmall 2xsmall xsmall small medium large xlarge 2xlarge 3xlarge …` (plus `zero`/`0`,
and `auto` for margins).

| Concern | Classes |
|---|---|
| Spacing | `p-* px-* py-* pt-* pb-* ps-* pe-*`, same for `m-*`, `gap-* row-gap-* column-gap-*` — e.g. `p-large`, `gap-medium`, `mb-small` |
| Colour | `bg-*` / `fg-* ` / `border-*` / `text-*` over `default alternate primary secondary neutral success warning danger info black white`, plus `-contrast` pairs — e.g. `bg-primary fg-primary-contrast` |
| Type | `font-*` size (`font-small` … `font-5xlarge`), weight (`font-normal font-strong font-mass font-elegant`), family (`font-text font-display font-code`), `text-center text-bold text-break` |
| Box | `rounded`, `rounded-small … rounded-3xlarge`, `rounded-full`, `rounded-circle`; `shadow`, `shadow-05 … shadow-95`; `border`, `border-0` |
| Layout | `d-flex d-grid d-block d-none`, `flex-column flex-wrap`, `align-items-center`, `justify-content-between`, `hstack` / `vstack`, `w-100` |
| Grid | `container`, `row` + `col col-6 row-cols-3` (flex grid), or `grid` + `g-col-4 g-start-3` (CSS grid) |

**Responsive** utilities are prefixed with a breakpoint and a colon:
`medium:g-col-4`, `large:col-6`, `medium:gap-large`. Breakpoints are
`small medium large xlarge 2xlarge`. Layout components take the same names as a
`responsive` prop, e.g. `<Col span={6} responsive={{ medium: { span: 4 } }} />`.

Reach for `var(--cx-*)` only for values utilities don't cover — `--cx-primary`,
`--cx-fg-color`, `--cx-bg-color`, `--cx-border-radius`, `--cx-gap`,
`--cx-font-family-text`. Component-scoped tokens (`--cx-card-*`, `--cx-accordion-*`) are
the supported way to restyle one component instance.

### Icons — read this before using `Icon`

`Icon` and `NotificationIcon` default to **SVG-sprite mode**, fetching
`/static/icons/chassis-icons.svg`. That path is the docs site's, and it does **not**
exist here — default-mode icons render empty. Use font mode instead, which ships with
this bundle:

```jsx
<Icon font name="check-solid" />          // renders (cx-* glyph class + webfont)
<Icon name="check-solid" />               // EMPTY here — sprite is not served
```

Pass `sprite="<url>"` explicitly only if you are serving your own sprite.

### Shared component props

Most components take `color` (the `ContextColor` set above: `default alternate primary
secondary neutral success danger warning info black white`) and many take `variant`
(`link basic outline smooth`; `solid` is the unmodified default). Layout components are
polymorphic via `component` — `<Stack component="section">`. Check `<Name>.d.ts` for the
exact set; do not assume a prop exists across components.

### Where the truth is

- `styles.css` — the single entry; it `@import`s the fonts and the whole compiled
  framework + component CSS (`_ds_bundle.css`). Read `_ds_bundle.css` for the real class
  and token definitions before inventing anything.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component docs (from the Chassis
  docs site) and `<Name>.d.ts` for the exact props.

### Idiomatic example

```jsx
const { ChassisThemeRoot, Card, CardBody, CardTitle, CardText, Button } = window.ChassisReact;

<ChassisThemeRoot theme="light">
  <div className="container p-large">
    <div className="grid gap-medium">
      <Card className="g-col-12 medium:g-col-4">
        <CardBody>
          <CardTitle>Weekly report</CardTitle>
          <CardText className="fg-neutral font-small">Updated 5 minutes ago.</CardText>
          <div className="d-flex gap-small align-items-center">
            <Button>Open</Button>
            <Button color="neutral" variant="outline">Dismiss</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  </div>
</ChassisThemeRoot>
```
