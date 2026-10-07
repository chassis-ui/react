## Building with Chassis

Chassis is a **CSS-framework-backed** design system: `@chassis-ui/react` supplies the
components, and `@chassis-ui/css` supplies a full utility-class layer plus ~1350 `--cx-*`
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

Scales are **named, not numeric**, and the names are **short**: `p-3`, `gap-2` and `m-4`
do not exist, and neither do the long forms `p-large` or `gap-medium`. The scale is
`4xs 3xs 2xs xs sm md lg xl 2xl 3xl 4xl 5xl 6xl` (plus `zero`/`0`, and `auto` for margins).

| Concern           | Classes                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spacing           | `p-* px-* py-* pt-* pb-* ps-* pe-*`, same for `m-*`, `gap-* row-gap-* column-gap-*` — e.g. `p-lg`, `gap-md`, `mb-sm`                                                                                                                                                                                                                                                                          |
| Colour            | `bg-*` / `fg-*` / `border-*` over `default alternate primary secondary neutral success warning danger info black white`; `bg-*` and `fg-*` also have `-contrast` pairs — e.g. `bg-primary fg-primary-contrast`. Neutral surfaces and text: `bg-main bg-even bg-evident`, `fg-main fg-subtle fg-slight`, `border-main border-subtle`. `text-*` is **not** a colour: there is no `text-primary` |
| Type              | size `font-2xs font-xs font-sm font-md font-lg font-xl font-2xl … font-5xl`; role `font-body font-label font-title font-heading font-lead font-hero`; weight `font-normal font-strong font-mass font-elegant`; family `font-text font-display font-code`; `text-center text-start text-end`, `text-bold text-italic text-uppercase`, `text-truncate text-nowrap text-break`                   |
| Box               | `rounded`, `rounded-xs … rounded-3xl`, `rounded-zero`, `rounded-full`, `rounded-circle`; `shadow`, `shadow-sm`, `shadow-lg`, `shadow-none`, `shadow-05 … shadow-95`; `border`, `border-top` (and `-end -bottom -start`), `border-0`                                                                                                                                                           |
| Layout            | `d-flex d-grid d-block d-none`, `flex-column flex-row flex-wrap flex-fill`, `align-items-center`, `justify-content-between`, `hstack` / `vstack`, `w-25 w-50 w-75 w-100 w-auto`, `h-100`                                                                                                                                                                                                      |
| Width in twelfths | `w-1/12 … w-11/12` — e.g. `w-6/12` is half, `w-4/12` a third                                                                                                                                                                                                                                                                                                                                  |
| Grid              | `container` (page width and margin), `grid` + `col-span-4 col-span-full col-start-3 row-span-2 row-start-2`, `grid-cols-3` for equal columns, `grid-fill` for as many columns as children                                                                                                                                                                                                     |

**Responsive** utilities are prefixed with a breakpoint and a colon:
`md:col-span-4`, `lg:grid-cols-3`, `md:gap-lg`, `sm:w-6/12`. Breakpoints are
`sm md lg xl 2xl`; an unprefixed class applies from the narrowest screen up. Layout
components take the same names as a `responsive` prop, e.g.
`<GridItem span="full" responsive={{ md: { span: 4 } }} />`.

Reach for `var(--cx-*)` only for values utilities don't cover — `--cx-primary`,
`--cx-fg-color`, `--cx-bg-color`, `--cx-border-radius`, `--cx-space-md`,
`--cx-grid-gutter`, `--cx-font-family-text`. Component-scoped tokens (`--cx-card-*`,
`--cx-button-*`, `--cx-nav-*`) are the supported way to restyle one component instance.

### Layout: the grid is CSS Grid

`.grid` is a twelve-column CSS grid whose gap is the gutter of the breakpoint (0.5rem on a
phone, up to 3rem on the widest screens). Use the components, or the classes they render:

```jsx
<Grid columns={1} gap="md" responsive={{ md: { columns: 3 } }}>{/* equal columns */}</Grid>

<Grid gap="lg">
  <GridItem span="full" responsive={{ lg: { span: 8 } }}>{/* main */}</GridItem>
  <GridItem span="full" responsive={{ lg: { span: 4 } }}>{/* aside */}</GridItem>
</Grid>
```

- An item with no `span` is **one track wide**, not full width. An item that stacks on
  small screens needs `span="full"` (`col-span-full`) plus the narrower span from a
  breakpoint up.
- `gap` takes a spacing token (`gap="md"` renders `gap-md`). A grid inside a card or a
  sidebar is narrower than the viewport the default gutter follows: give it a `gap` and a
  `columns` count that fits.
- `<Grid fill min="12rem">` lays children out in equal columns that wrap when they would
  get narrower than `min`: use it for card walls and stat rows.
- A grid sizes its tracks from the container. For items as wide as their content, use
  `<Flex gap="md">` or `d-flex gap-md`, with `flex-fill` on the items that grow.
- A grid in a narrow box can follow the box instead of the viewport: put `contains-inline`
  on an ancestor, set `contained` on the `Grid`, and key `responsive` by `'@md'` in place
  of `md` (`responsive={{ '@md': { columns: 3 } }}` renders `@md:grid-cols-3`).
- `rows` (1 to 6) sets equal rows, `flow="column"` fills them column by column, and
  `GridItem` takes `end` / `rowEnd` beside `start` / `rowStart` (`span={3} end={13}` sits
  against the end edge).
- **There is no `Row` or `Col`, and no `row` / `col-{n}` / `offset-*` / `g-*` class.** The
  flexbox grid is gone; `col-auto` exists with another meaning (`grid-column: auto`).

### Icons — read this before using `Icon`

`Icon`, and the icons components draw themselves (close buttons, carets, checks), default
to **SVG-sprite mode**: they reference a sprite embedded in the page, and no sprite is
embedded here, so they render empty. The icon font ships with this bundle. Switch the
whole tree to it once, at the root:

```jsx
const { ChassisThemeRoot, IconProvider, Icon } = window.ChassisReact;

<ChassisThemeRoot theme="light">
  <IconProvider font>
    <Icon name="check-solid" />           {/* renders: cx-* glyph class + webfont */}
  </IconProvider>
</ChassisThemeRoot>
```

`<Icon font name="check-solid" />` does the same for one icon. Pass `sprite="<url>"` only
if you are serving your own sprite from the same origin.

### Shared component props

Most components take `color` (the `ContextColor` set above: `default alternate primary
secondary neutral success danger warning info black white`). Many take `variant`:
`basic solid outline smooth` on `Card`, `Badge` and `Chip`; `basic outline smooth link` on
`Button`, where the solid look is the default with no `variant`. Sizes are `size="sm"` and
`size="lg"`; the medium size is the default with no prop. Layout components are
polymorphic via `component` — `<Stack component="section">`. Check `<Name>.d.ts` for the
exact set; do not assume a prop exists across components.

- `Nav` and `TabList` take `variant="tabs" | "segments" | "underline"`. `segments` is a
  segmented control; it was called `pills`, which is deprecated.
- A component that shows and hides (`Modal`, `Drawer`, `Popover`, `Tooltip`, `Menu`,
  `Toast`) takes `visible` (controlled), `defaultVisible` and `onVisibleChange`.
- `Skeleton` takes `span` in twelfths of its parent: `<Skeleton span={6} />` is half.

### Where the truth is

- `styles.css` — the single entry; it `@import`s the fonts and the whole compiled
  framework + component CSS (`_ds_bundle.css`). Read `_ds_bundle.css` for the real class
  and token definitions before inventing anything.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component docs (from the Chassis
  docs site) and `<Name>.d.ts` for the exact props.

### Idiomatic example

```jsx
const { ChassisThemeRoot, IconProvider, Grid, Card, CardBody, CardTitle, CardText, Button } =
  window.ChassisReact;

<ChassisThemeRoot theme="light">
  <IconProvider font>
    <div className="container py-lg">
      <Grid columns={1} gap="md" responsive={{ md: { columns: 3 } }}>
        <Card>
          <CardBody>
            <CardTitle>Weekly report</CardTitle>
            <CardText className="fg-subtle font-sm">Updated 5 minutes ago.</CardText>
            <div className="d-flex gap-sm align-items-center">
              <Button>Open</Button>
              <Button color="neutral" variant="outline">Dismiss</Button>
            </div>
          </CardBody>
        </Card>
      </Grid>
    </div>
  </IconProvider>
</ChassisThemeRoot>
```
