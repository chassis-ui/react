# Chassis React

> React component library for the Chassis Design System, built on Chassis CSS and TypeScript.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@chassis-ui/react)](https://www.npmjs.com/package/@chassis-ui/react)
[![CI](https://github.com/chassis-ui/react/workflows/CI/badge.svg?branch=main)](https://github.com/chassis-ui/react/actions?query=workflow%3ACI+branch%3Amain)

## Overview

Chassis React is the React implementation of the Chassis Design System — a set of accessible,
fully-typed components styled with `@chassis-ui/css` and driven by `@chassis-ui/tokens`. It
pairs with the [Chassis React docs site](https://chassis-ui.com/react/), an Astro-based reference
of live examples and API tables generated from the library's own TypeScript source.

## Features

- **Accessible by default**: components are built on [React Aria](https://react-spectrum.adobe.com/react-aria/) and [React Stately](https://react-spectrum.adobe.com/react-stately/), covering keyboard interaction, focus management, and ARIA out of the box.
- **Token-driven styling**: components style themselves through Chassis CSS and design tokens rather than component-scoped CSS, so brand and theme changes apply without touching component code.
- **Fully typed**: written in strict TypeScript, with prop tables for the docs site generated directly from source via `react-docgen-typescript`.
- **Tested and covered**: a Vitest suite with coverage thresholds, plus Storybook + Playwright visual regression for the calendar/datepicker family.

## Getting Started

### Installation

Requires React and React DOM 18 or later:

```shell
npm install @chassis-ui/react @chassis-ui/css
```

### Usage

```js
import "@chassis-ui/css/dist/css/chassis.min.css";
import { Button } from "@chassis-ui/react";

function App() {
  return <Button color="primary">Submit</Button>;
}
```

A handful of components — `Calendar`, `RangeCalendar`, `DatePicker`, `DateRangePicker`, and
`Table`'s sort/selection UI — have no `@chassis-ui/css` visual equivalent, so `@chassis-ui/react`
ships its own compiled stylesheet for just those pieces. Import it once alongside the
`@chassis-ui/css` stylesheet above:

```js
import "@chassis-ui/react/style.css";
```

Skipping this import doesn't error — those specific pieces will just render unstyled. Every other
component is styled entirely through `@chassis-ui/css` and needs nothing extra.

Read the [Getting Started guide](https://chassis-ui.com/react/getting-started/introduction/) for
setup details, theming, and per-component usage.

## Documentation

Component docs, live examples, and API reference are published at
[chassis-ui.com/react](https://chassis-ui.com/react/).

### Running the docs site locally

This is a `pnpm` workspace monorepo — its own source, not the published npm package — so it's
only relevant if you're contributing to Chassis React itself.

**Prerequisites:** Node 24 and pnpm 10 or later.

```shell
git clone https://github.com/chassis-ui/react.git
cd react
pnpm install
pnpm start
```

Open `http://localhost:4327/react/` in your browser.

### Available scripts

| Script | Description |
| --- | --- |
| `pnpm start` | Sync submodules, build the library, then watch the library and Astro site together |
| `pnpm setup` | Sync submodules and build the library once — the part of `start` worth running on its own |
| `pnpm dev` | Watch the library and Astro site without rebuilding submodules |
| `pnpm site:dev` | Start only the Astro dev server |
| `pnpm site:build` | Generate API data, sync submodules, and build the static docs site |
| `pnpm site:preview` | Preview the built docs site locally |
| `pnpm react:generate` | Re-generate prop table JSON from TypeScript source |
| `pnpm test` | Run component tests with coverage |
| `pnpm react:build` | Build the component library |

## Chassis Ecosystem

This project is part of the Chassis Design System's multi-repository architecture:

| Project | Description |
| --- | --- |
| [chassis-website](https://github.com/chassis-ui/website) | Main website and shared documentation package |
| [chassis-css](https://github.com/chassis-ui/css) | CSS framework and component library |
| **chassis-react** | **React component library (this repository)** |
| [chassis-tokens](https://github.com/chassis-ui/tokens) | Design token generation and management |
| [chassis-icons](https://github.com/chassis-ui/icons) | Icon library and build toolkit |
| [chassis-assets](https://github.com/chassis-ui/assets) | Multi-platform asset management |
| [chassis-figma](https://github.com/chassis-ui/figma) | Figma component documentation |

All documentation sites share the `@chassis-ui/docs` package for consistent layouts, components,
and styling.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test the build: `pnpm react:build && pnpm test`
5. Commit your changes: `git commit -m "feat: add my feature"`
6. Push to the branch: `git push origin feature/my-feature`
7. Open a Pull Request

Please read through our [contributing guidelines](.github/CONTRIBUTING.md) for coding standards
and development notes. Everyone participating in this project is expected to follow our
[Code of Conduct](.github/CODE_OF_CONDUCT.md). Found a security vulnerability? Please don't open a
public issue — see our [security policy](.github/SECURITY.md) for private disclosure instead.

## License

MIT License — see [LICENSE](LICENSE) file for details.
