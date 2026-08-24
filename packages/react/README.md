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

## License

Code released under the [MIT License](./LICENSE).
