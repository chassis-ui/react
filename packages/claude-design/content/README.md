The Chassis React component library in <!-- brand-names -->, each in light and dark. `@chassis-ui/react` supplies the components and `@chassis-ui/css` the classes and the `--cx-*` custom properties. Use library components for controls, and Chassis utility classes for your own layout and spacing. Do not invent class names, and do not write CSS where a utility exists.

## Brand and mode

Brand and mode are two attributes. Either can sit on any element, and everything inside inherits them, so one pair on `<html>` or the app's root sets the whole page.

| Attribute       | Values             | Without it                      |
| --------------- | ------------------ | ------------------------------- |
| `data-cx-brand` | <!-- brand-ids --> | <!-- default-brand -->          |
| `data-cx-theme` | `light` · `dark`   | follows the viewer's OS setting |

```html
<html data-cx-brand="{{brand}}" data-cx-theme="light">
```

Always set `data-cx-theme`. Every colour is a `light-dark()` value, so without it a design changes with the viewer's OS. Brands nest: an element with another `data-cx-brand` inside a page renders as that brand, so brands can sit side by side on one canvas.

```jsx
<div className="d-grid grid-cols-2 gap-md">
  <section data-cx-brand="{{default}}" className="p-md"><Button>Save</Button></section>
  <section data-cx-brand="{{brand}}" className="p-md"><Button>Save</Button></section>
</div>
```

The theme menu on this page sets brand and mode together for the previews: <!-- theme-names -->. The Colors and Shadows sections show every theme as a column. Typography has a set of styles per brand, and Corner radius a radius per brand, named after it (`<brand>-radius-md`).

## How the brands differ

Spacing, type sizes and line heights, shadows, border widths, breakpoints and every component's structure are shared. The brands differ where the table below shows, in colours, faces, corners and some weights:

<!-- brand-table -->

Corners are tokens, not fixed values: write `rounded` or `rounded-lg`, never a pixel radius, and a component takes each brand's shape by itself.

## Using it in a design

Load the stylesheet, then React, then the bundle, in this order:

```html
<link rel="stylesheet" href="components/bundle.css">
<script src="components/lib/react.js"></script>
<script src="components/lib/react-dom.js"></script>
<script src="components/bundle.js"></script>
```

The components are on `window.ChassisReact`. The two files in `components/lib/` are React and ReactDOM <!-- react-version -->, which the previews on this page use. On a Claude Design canvas, leave them out: the canvas supplies React 18, and the components render with it.

```jsx
const { Card, CardBody, CardTitle, CardText, Button } = window.ChassisReact;

ReactDOM.createRoot(document.getElementById('app')).render(
  <div data-cx-brand="{{brand}}" data-cx-theme="light" className="container py-lg">
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
  </div>
);
```

Date and time components take values from `@internationalized/date`, which the bundle exposes as `ChassisReact.Dates`: `<DatePicker defaultValue={Dates.parseDate('2026-11-14')} />`, and `parseTime`, `parseDateTime`, `today(getLocalTimeZone())`, `CalendarDate`, `Time`.

The font files of every brand and the icon font are in `fonts/`, and `tokens.css` declares their `@font-face` rules, so a page that loads `tokens.css` has every brand's faces.

## In a project

A project (a Claude Design canvas, or any page built on this system) shows one brand at a time and switches to another with one setting.

**Load order.** Copy `tokens.css`, `fonts/` and `components/` into the project, then load, in this order:

```html
<link rel="stylesheet" href="ds/<folder>/tokens.css">
<link rel="stylesheet" href="ds/<folder>/components/bundle.css">
<script src="ds/<folder>/components/bundle.js"></script>
```

`tokens.css` declares every brand's fonts. Without it, a design renders in fallback faces, and switching brand leaves the type unchanged. On a canvas, leave out `components/lib/`: the canvas supplies React 18.

**Brand and mode on the root.** Set `data-cx-brand` and `data-cx-theme` once, on the design's root element, and nowhere else. On a canvas, make them tweaks, so the Tweaks panel switches the whole design:

```html
<div data-cx-brand="{{ brand }}" data-cx-theme="{{ mode }}">…</div>
<script type="text/x-dc" data-dc-script data-props='{"brand":{"editor":"enum","options":<!-- brand-ids-json -->,"default":"<!-- default-brand-id -->"},"mode":{"editor":"enum","options":["light","dark"],"default":"light"}}'>
class Component extends DCLogic {
  renderVals() {
    return { brand: this.props.brand ?? '<!-- default-brand-id -->', mode: this.props.mode ?? 'light' };
  }
}
</script>
```

**No hard-coded values.** A brand switch reaches only what reads the brand: components, utility classes and `var(--cx-…)` properties. A literal colour, font family, radius or shadow stays as written when the brand changes. Use `bg-primary`, `font-display`, `rounded-lg`, `shadow` or `var(--cx-primary)`, never a hex colour, a font's name or a radius in pixels.

**Brand assets.** This system carries no logos, favicons or images. Each brand's are in Chassis Assets, the public `chassis-ui/assets` repository, under the same names in every brand: <!-- brand-asset-names -->.

At the version this system is built with, a brand's file is at

```text
<!-- brand-asset-url -->
```

and a file the brand doesn't have of its own is the default one, at `<!-- default-asset-url -->`. For the default brand's light logo, that is <!-- brand-asset-example -->.

A canvas shows only images uploaded to it. Download each file the design needs, for every brand it switches between, upload them to the project, and pick one with the same `brand` value, so it switches with the rest:

```js
renderVals() {
  const brand = this.props.brand ?? '<!-- default-brand-id -->'
  const logos = { <!-- brand-logo-map --> }
  return { brand, logo: logos[brand] }
}
```

## Colour

Every colour is one of eleven contexts: `default`, `alternate`, `primary`, `secondary`, `neutral`, `success`, `danger`, `warning`, `info`, `black` and `white`. Components take the context as a `color` prop. Each context has:

- a base colour (`--cx-primary`), the fill of solid components, and a contrast colour (`--cx-primary-contrast`) for text on that fill;
- roles for text (`fg-main`, `fg-subtle`), surfaces (`bg-main`, `bg-evident`) and borders (`border-main`, `border-subtle`);
- a tonal scale from `05` to `95`, the same in light and dark.

The swatches on this page drop the `cx-` prefix: the swatch `primary-fg-main` is `--cx-primary-fg-main` and the class `primary-fg-main`.

## Utility classes

Scales are named, not numbered, and the names are short: `zero 4xs 3xs 2xs xs sm md lg xl 2xl 3xl 4xl 5xl 6xl`, plus `auto` for margins. `p-md` and `gap-sm` are classes; `p-3`, `gap-2` and `p-large` don't exist.

| Concern           | Classes                                                                                                                                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spacing           | `p-* px-* py-* pt-* pb-* ps-* pe-*`, the same set for `m-*`, and `gap-* row-gap-* column-gap-*`: `p-lg`, `gap-md`, `mb-sm`                                                                                                                                        |
| Solid colour      | `bg-<context>` with `fg-<context>-contrast` (`bg-primary fg-primary-contrast`). `fg-a11y` picks a readable text colour on any `bg-<context>`                                                                                                                      |
| Tinted surfaces   | `primary-bg-evident primary-fg-main`, `neutral-bg-main`, `border danger-border-main`                                                                                                                                                                              |
| Roles             | `bg-main bg-even bg-evident`, `fg-main fg-subtle fg-slight`, `border-main border-subtle`: these follow the nearest context, else `default`. `text-*` is not a colour; there is no `text-primary`                                                                  |
| Type              | size `font-2xs` to `font-5xl`; role `font-body font-label font-title font-h1 … font-h6 font-lead font-hero`; weight `font-normal font-strong font-mass font-elegant`; family `font-ui font-prose font-display font-code`; `text-center text-truncate text-nowrap` |
| Shape             | `rounded`, `rounded-xs` to `rounded-3xl`, `rounded-zero`, `rounded-full`, `rounded-circle`; `shadow-sm shadow shadow-lg shadow-none`; `border`, `border-top` (and `-end -bottom -start`)                                                                          |
| Layout            | `d-flex d-grid d-block d-none`, `flex-column flex-wrap flex-fill`, `align-items-center`, `justify-content-between`, `hstack vstack`, `w-25 w-50 w-75 w-100 w-auto`, `h-100`                                                                                       |
| Width in twelfths | `w-1/12` to `w-11/12`: `w-6/12` is half, `w-4/12` a third                                                                                                                                                                                                         |
| Grid              | `container`; `grid` with `col-span-4 col-span-full col-start-3 row-span-2`, `grid-cols-3` for equal columns, `grid-fill` for as many columns as children                                                                                                          |

Responsive classes put the breakpoint first and a colon: `md:col-span-4`, `lg:grid-cols-3`, `md:gap-lg`. The breakpoints are `sm md lg xl 2xl`, and an unprefixed class applies from the narrowest screen up.

Write `var(--cx-…)` only where no utility exists (`--cx-primary`, `--cx-fg-main`, `--cx-border-radius`, `--cx-space-md`, `--cx-font-family-ui`). Component tokens (`--cx-card-*`, `--cx-button-*`) are the supported way to restyle one instance.

## Layout

`.grid` is a twelve-column CSS grid whose gap is the gutter of the breakpoint. Use the components, or the classes they render:

```jsx
<Grid columns={{ base: 1, md: 3 }} gap="md">{/* equal columns */}</Grid>

<Grid gap="lg">
  <GridItem span={{ base: 'full', lg: 8 }}>{/* main */}</GridItem>
  <GridItem span={{ base: 'full', lg: 4 }}>{/* aside */}</GridItem>
</Grid>
```

- An item with no `span` is one track wide, not full width. An item that stacks on small screens takes `'full'` as the `base` of its `span`, plus the narrower span from a breakpoint up.
- `<Grid fill min="12rem">` lays children out in equal columns that wrap below `min`: use it for card walls and stat rows.
- For items as wide as their content, use `<Flex gap="md">` or `d-flex gap-md`, with `flex-fill` on the items that grow.
- There is no `Row` or `Col`, and no `row`, `col-{n}`, `offset-*` or `g-*` class.

## Icons

Icon names are the glyph names of Chassis Icons: `check-solid`, `xmark-outline`, `chevron-right-outline`, `search-outline`. `Icon`, and the icons components draw themselves (close buttons, carets, checks), default to an SVG sprite embedded in the page. The previews here embed it. A design of your own does not have it, so switch the tree to the icon font: `bundle.css` has its glyph classes and `tokens.css` its face, from `fonts/`:

```jsx
const { IconProvider, Icon } = window.ChassisReact;

<IconProvider font>
  <Icon name="check-solid" />
</IconProvider>
```

`<Icon font name="check-solid" />` does the same for one icon.

## Shared props

- `color` takes a context (above). `variant` is `basic solid outline smooth` on `Card`, `Badge` and `Chip`, and `basic outline smooth link` on `Button`, whose solid look is the default. Sizes are `size="sm"` and `size="lg"`, and the medium size has no prop.
- Layout components are polymorphic through `component`: `<Stack component="section">`.
- A component that shows and hides (`Modal`, `Drawer`, `Popover`, `Tooltip`, `Menu`, `Toast`) takes `visible`, `defaultVisible` and `onVisibleChange`.
- `Nav` and `TabList` take `variant="tabs" | "segments" | "underline"`.
- Each component's card lists its props, and `components/index.d.ts` holds every type. Check them before assuming a prop exists across components.

## Type

Type sizes from `xl` up are fluid `clamp()` values; the specimens on this page show them at their largest. Headings use the display face, running text the prose face, and controls and labels the ui face, each brand with its own (table above).
