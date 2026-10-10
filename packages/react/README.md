<p align="center">
  <a href="https://chassis-ui.com/react">
    <img
      src="https://chassis-ui.com/static/images/site-logo.svg"
      alt="Chassis UI Logo"
      width="300"
    />
  </a>
</p>

<p align="center">
  React component library built on Chassis CSS and TypeScript.
  <br>
  <a href="https://chassis-ui.com/react/getting-started/introduction/"><strong>Explore the Chassis React docs »</strong></a>
  <br>
  <br>
  <a href="https://www.npmjs.com/package/@chassis-ui/react"><img src="https://img.shields.io/npm/v/@chassis-ui/react" alt="npm version"></a>
  <a href="https://github.com/chassis-ui/react/actions/workflows/ci.yml?query=branch%3Adevelop"><img src="https://github.com/chassis-ui/react/actions/workflows/ci.yml/badge.svg?branch=develop" alt="CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/@chassis-ui/react" alt="License: MIT"></a>
  <br>
  <br>
  <a href="https://github.com/chassis-ui/react/issues/new/choose">Report a bug or request a feature</a>
</p>

## Installation

The components render `@chassis-ui/css`'s markup and class names, so install both:

```bash
npm install @chassis-ui/react @chassis-ui/css
```

`@chassis-ui/css` is a peer dependency, pinned to one 0.x minor (`>=0.7.0 <0.8.0` today): before
1.0 a minor release of it can rename the tokens the components rely on.

## Stylesheets

Import the Chassis CSS stylesheet once, then this package's own stylesheet:

```js
import '@chassis-ui/css/dist/css/chassis.min.css'
import '@chassis-ui/react/style.css'
```

`@chassis-ui/react/style.css` covers the pieces with no `@chassis-ui/css` equivalent: the
calendars and date pickers, `TimeField`, `NumberField`, `SearchField`, `DataGrid`, `Tree`,
`Notification`'s fade, `Divider`'s label and `Table`'s sort and selection UI. Without it those
pieces render unstyled; everything else is styled by `@chassis-ui/css` alone.

## Usage

```jsx
import { Button } from '@chassis-ui/react'

export function Example() {
  return <Button color="primary">Click me</Button>
}
```

### Subpath imports

Every component folder is also its own entry point. Importing from a subpath keeps a bundler from
pulling in the rest of the library, which matters most in the Next.js App Router:

```jsx
import { Button } from '@chassis-ui/react/button'
import { Modal, ModalBody, ModalHeader } from '@chassis-ui/react/modal'
```

### `asChild`

Every component with a `component` prop also takes `asChild`: the component's classes, props and
ref are merged onto its single child element. Use it to style a router link, and from a React
Server Component, where a component reference can't be passed as a prop:

```jsx
import Link from 'next/link'
import { Button } from '@chassis-ui/react/button'

export function LoginButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/login">Log in</Link>
    </Button>
  )
}
```

See [Server-side rendering](https://chassis-ui.com/react/getting-started/ssr/) for more, and the
[docs](https://chassis-ui.com/react/getting-started/introduction/) for every component's props and
examples.

## Peer dependencies

- `react` and `react-dom`: `^19.0.0`
- `@chassis-ui/css`: `>=0.7.0 <0.8.0`

## Browser support

Chrome 107+, Edge 107+, Firefox 104+, Safari 16+: the "baseline widely available" set, also
declared as the `browserslist` field in this package's `package.json` and used as the build's
`es2022` output target. The published bundle is not down-levelled below that, so a project
supporting older browsers needs to transpile `node_modules/@chassis-ui/react` itself.

The build is minified and ships source maps with the original TypeScript embedded, so stack
traces and debuggers show the source.

## License

Code released under the [MIT License](./LICENSE).
