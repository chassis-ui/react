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
  React.js component library built on Chassis CSS and TypeScript.
  <br>
  <a href="https://chassis-ui.com/react/getting-started/introduction"><strong>Explore the Chassis React docs »</strong></a>
  <br>
  <br>
  <a href="https://github.com/chassis-ui/react/issues/new?template=bug_report.md">Report bug</a>
  ·
  <a href="https://github.com/chassis-ui/react/issues/new?template=feature_request.md">Request feature</a>
</p>

## Installation

```bash
npm install @chassis-ui/react
```

or

```bash
yarn add @chassis-ui/react
```

## Stylesheets

React components are styled with the `@chassis-ui/css` library.

```bash
npm install @chassis-ui/css
```

```js
import '@chassis-ui/css/dist/css/chassis.min.css'
```

## Usage

```jsx
import { Button } from '@chassis-ui/react'

export function Example() {
  return <Button color="primary">Click me</Button>
}
```

See the [Getting started page](https://chassis-ui.com/react/getting-started/introduction/) for the full component catalog, props, and examples.

## Peer dependencies

- `react` ≥ 18
- `react-dom` ≥ 18

## Browser support

Chrome 107+, Edge 107+, Firefox 104+, Safari 16+ — the "baseline widely available" set, also
declared as the `browserslist` field in this package's `package.json` and used as the build's
`es2022` output target. The published bundle is not down-levelled below that, so a project
supporting older browsers needs to transpile `node_modules/@chassis-ui/react` itself.

There is no Node version requirement for consumers: this is a browser library, and the package
deliberately declares no `engines` field. (Building this repo needs Node 24 — see the root
`package.json` — but that never reaches a consumer's install.)

## License

Code released under the [MIT License](./LICENSE).
