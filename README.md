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
  React.js Components Library built on top of Chassis CSS and TypeScript backed by the professional team.
  <br>
  <a href="https://chassis-ui.com/react/getting-started/introduction"><strong>Explore Chassis React docs »</strong></a>
  <br>
  <br>
  <a href="https://github.com/chassis-ui/react/issues/new?template=bug_report.md">Report bug</a>
  ·
  <a href="https://github.com/chassis-ui/react/issues/new?template=feature_request.md">Request feature</a>
  ·
  <a href="https://blog.coreui.io/">Blog</a>
</p>


## Table of contents

- [Quick start](#quick-start)
- [Status](#status)
- [What's included](#whats-included)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Community](#community)
- [Versioning](#versioning)
- [Creators](#creators)
- [Copyright and license](#copyright-and-license)

## Quick start

### Instalation

Several quick start options are available:

- [Download the latest release](https://github.com/chassis-ui/react/archive/v0.1.0.zip)
- Clone the repo: `git clone https://github.com/chassis-ui/react.git`
- Install with [npm](https://www.npmjs.com/): `npm install @chassis-ui/react`
- Install with [yarn](https://yarnpkg.com/): `yarn add @chassis-ui/react`

Read the [Getting started page](https://chassis-ui.com/react/getting-started/introduction/) for information on the framework contents, templates and examples, and more.

### Stylesheets

React components are styled using `Chassis` CSS library.

#### Installation

```bash
yarn add @chassis-ui/css
```

or

```bash
npm install @chassis-ui/css
```

##### Basic usage

```js
import "@chassis-ui/css/dist/css/chassis.min.css";
```

## Status

[![Build Status](https://github.com/chassis-ui/react/workflows/JS%20Tests/badge.svg?branch=main)](https://github.com/chassis-ui/react/actions?query=workflow%3AJS+Tests+branch%3Amain)
[![npm version](https://img.shields.io/npm/v/@chassis-ui/react)](https://www.npmjs.com/package/@chassis-ui/react)
[![peerDependencies Status](https://img.shields.io/david/peer/coreui/coreui)](https://david-dm.org/coreui/coreui?type=peer)
[![devDependency Status](https://img.shields.io/david/dev/coreui/coreui)](https://david-dm.org/coreui/coreui?type=dev)
[![Coverage Status](https://img.shields.io/coveralls/github/coreui/coreui-react/main)](https://coveralls.io/github/coreui/coreui-react?branch=main)

## Bugs and feature requests

Have a bug or a feature request? Please first read the [issue guidelines](https://github.com/chassis-ui/react/blob/main/.github/CONTRIBUTING.md#using-the-issue-tracker) and search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/chassis-ui/react/issues/new).

## Documentation

The documentation for the Chassis React is hosted at our website [Chassis React](https://chassis-ui.com/react/)

### Running documentation locally

1. Run `pnpm install` to install all dependencies.
2. From the root directory, run `pnpm start` to build the library, start the library in watch mode, and start the Astro dev server.
3. Open `http://localhost:4327/react/` in your browser.

### Available scripts

| Script | Description |
|---|---|
| `pnpm start` | Sync submodules, build the library, then watch the library and Astro site together |
| `pnpm dev` | Watch the library and Astro site without rebuilding submodules |
| `pnpm astro:dev` | Start only the Astro dev server |
| `pnpm site:build` | Generate API data, sync submodules, and build the static docs site |
| `pnpm astro:preview` | Preview the built docs site locally |
| `pnpm api:generate` | Re-generate prop table JSON from TypeScript source |
| `pnpm test` | Run component tests with coverage |
| `pnpm lib:build` | Build the component library |

## Contributing

Please read through our [contributing guidelines](https://github.com/chassis-ui/react/blob/main/.github/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

Editor preferences are available in the [editor config](https://github.com/chassis-ui/react/blob/main/.editorconfig) for easy use in common text editors. Read more and download plugins at <https://editorconfig.org/>.

## Community

Stay up to date on the development of Chassis React and reach out to the community with these helpful resources.

- Read and subscribe to [The Official CoreUI Blog](https://blog.coreui.io/).

You can also follow [@core_ui on Twitter](https://twitter.com/core_ui).

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, Chassis React is maintained under [the Semantic Versioning guidelines](http://semver.org/).

See [the Releases section of our project](https://github.com/chassis-ui/react/releases) for changelogs for each release version.

## Creators

**Łukasz Holeczek**

- <https://twitter.com/lukaszholeczek>
- <https://github.com/mrholek>

**Andrzej Kopański**

- <https://github.com/xidedix>

**The CoreUI Team**

- <https://github.com/orgs/coreui/people>

## Copyright and license

Copyright 2021 creativeLabs Łukasz Holeczek. Code released under the [MIT License](https://github.com/chassis-ui/react/blob/main/LICENSE). Docs released under [Creative Commons](https://creativecommons.org/licenses/by/3.0/).
