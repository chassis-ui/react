# `smoke-test-tailwind`

Not a real app — a framework integration smoke test for `@chassis-ui/react`. Its only job is to
prove that every class the components render has a rule when a project builds `@chassis-ui/css`
with Tailwind CSS, through a real Tailwind build, not a list of class names.

In the Tailwind entry of `@chassis-ui/css` a utility is generated only where Tailwind's scanner
finds its whole name. The classes of this package escaped it in two ways (#54), and nothing
warned: the build passed and the layout was wrong.

- The package sits in `node_modules`, which Tailwind does not scan. `src/app.css` registers it
  with `@source`, so the whole class names in its `dist` are found.
- The layout props build their names when they render (`md:col-span-3`). `src/app.css` loads the
  opt-in safelist of `@chassis-ui/css`, which lists them.

`src/app.css` is the stylesheet the Tailwind page of the docs gives a project
(`packages/site/content/getting-started/tailwind.mdx`). Change the two together.

```bash
pnpm smoke:build   # from the repo root: builds the library first, then dist/app.css
pnpm smoke:test    # the same, then runs tests/. CI runs both
```

## What the test checks

`src/page.mjs` is a page of a project: components and props, and no class name of its own.
`tests/classes.test.mjs` renders it on the server, reads the classes out of the markup, and fails
on one that the regular build of `@chassis-ui/css` styles and `dist/app.css` does not. It also
checks that a class nothing names still has no rule, so the build is still on demand.

A component that builds a utility name from a prop, or a layout prop with a value the safelist
does not list, fails here once the page uses it. The sweeps of
`packages/react/test/utils/tailwindClassNames.spec.tsx` catch both for every component, without a
Tailwind build; this app is the proof that the setup the docs describe works in one.

The tests name the classes they expect, so `src/app.css` keeps `tests/` out of what Tailwind
scans. Without that line a class would get its rule from the test.

`private: true`, excluded from Changesets (`.changeset/config.json`'s `ignore`) and from the root
`pnpm lint`, which lints `packages/react` and `packages/site` only.
