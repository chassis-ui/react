// `pnpm new:component <kebab-name> [--group <sidebar group>]`: scaffolds a component in the shape
// every component here has, across both packages. It writes the component, its barrel, both
// entries in `src/index.ts`, a spec, a story, a docs page with one example, and the sidebar entry,
// then prints the commands still to run. See `packages/react/CONVENTIONS.md` for the rules the
// files follow, and "Conventions" in `packages/react/AGENTS.md` for what a real component adds.
//
// The component it writes is polymorphic (`createPolymorphicComponent`, so `component` and
// `asChild` work) and renders a `<div>` with the class named after the component. Replace the body;
// keep the shape.
import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ROOT = path.resolve(__dirname, '..')
const REACT = path.join(ROOT, 'packages/react')
const SITE = path.join(ROOT, 'packages/site')
const INDEX = path.join(REACT, 'src/index.ts')
const SIDEBAR = path.join(SITE, 'data/sidebar.yml')
const DEFAULT_GROUP = 'Data Display'

function fail(message: string): never {
  console.error(`new:component: ${message}`)
  process.exit(1)
}

function parseArgs(argv: string[]) {
  const positional: string[] = []
  let group = DEFAULT_GROUP
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] as string
    if (arg === '--group') {
      const value = argv[++i]
      if (!value) fail('`--group` needs a value, such as `--group "Form Controls"`.')
      group = value
    } else if (arg.startsWith('--group=')) {
      group = arg.slice('--group='.length)
    } else if (arg.startsWith('-')) {
      fail(`unknown option \`${arg}\`.`)
    } else {
      positional.push(arg)
    }
  }
  if (positional.length !== 1) {
    fail('usage: pnpm new:component <kebab-name> [--group <sidebar group>]')
  }
  return { name: positional[0] as string, group }
}

const { name: kebab, group } = parseArgs(process.argv.slice(2))

if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(kebab)) {
  fail(`\`${kebab}\` isn't a kebab-case name, such as \`number-field\`.`)
}

// `number-field` → `NumberField` (export) and `Number Field` (sidebar title, which the docs site
// slugifies back to `number-field`, the page's file name).
const words = kebab.split('-')
const pascal = words.map((word) => word[0]!.toUpperCase() + word.slice(1)).join('')
const title = words.map((word) => word[0]!.toUpperCase() + word.slice(1)).join(' ')

const files: Record<string, string> = {
  [`packages/react/src/components/${kebab}/${pascal}.tsx`]: `import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ${pascal}OwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use an HTML element or a component.
   *
   * @default 'div'
   */
  component?: C
}

export type ${pascal}Props<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ${pascal}OwnProps<C>
>

type ${pascal}Component = (<C extends ElementType = 'div'>(
  props: ${pascal}Props<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ${pascal}Render<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: ${pascal}Props<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'

  return (
    <Component className={classNames('${kebab}', className)} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const ${pascal} = createPolymorphicComponent<${pascal}Component>(
  ${pascal}Render as ForwardRefRenderFunction<Element, ${pascal}Props<ElementType>>,
  '${pascal}'
)
`,
  [`packages/react/src/components/${kebab}/index.ts`]: `'use client'

import '../../utils/suppressFocusRingGlobally'

export { ${pascal} } from './${pascal}'
export type { ${pascal}Props } from './${pascal}'
`,
  [`packages/react/test/components/${kebab}/${pascal}.spec.tsx`]: `import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ${pascal} } from '../../../src/index'

describe('${pascal}', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<${pascal}>Content</${pascal}>)
      const element = screen.getByText('Content')
      expect(element).toHaveClass('${kebab}')
      expect(element.tagName).toBe('DIV')
    })

    test("adds the caller's className after its own", () => {
      render(<${pascal} className="custom">Content</${pascal}>)
      expect(screen.getByText('Content')).toHaveClass('${kebab}', 'custom')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the root element', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<${pascal} ref={ref}>Content</${pascal}>)
      expect(ref.current).toBe(screen.getByText('Content'))
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<${pascal}>Content</${pascal}>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
`,
  [`packages/react/stories/${kebab}/${pascal}.stories.tsx`]: `import type { Meta, StoryObj } from '@storybook/react-vite'

import { ${pascal} } from '../../src/components/${kebab}/${pascal}'

const meta: Meta<typeof ${pascal}> = {
  component: ${pascal},
  title: '${kebab}/${pascal}'
}

export default meta

type Story = StoryObj<typeof ${pascal}>

export const Default: Story = {
  args: {
    children: '${title}'
  }
}
`,
  [`packages/site/examples/components/${kebab}/BasicExample.tsx`]: `import { ${pascal} } from '@chassis-ui/react'

export const Example = () => <${pascal}>${title}</${pascal}>
`,
  [`packages/site/content/components/${kebab}.mdx`]: `---
title: ${title}
description: TODO — one sentence on what ${title} is for.
toc: true
---

import { Example as BasicExample } from '../../examples/components/${kebab}/BasicExample.tsx'

## Basic usage

<Example>
  <BasicExample client:load />
</Example>

## API

### ${pascal}

<PropTable component="${pascal}" />
`
}

// Everything is checked before anything is written, so a failed run leaves no partial component.
for (const file of Object.keys(files)) {
  if (fs.existsSync(path.join(ROOT, file))) fail(`\`${file}\` already exists.`)
}

const index = fs.readFileSync(INDEX, 'utf8')
if (new RegExp(`from './components/${kebab}'`).test(index)) {
  fail(`\`src/index.ts\` already imports \`./components/${kebab}\`.`)
}

const sidebar = fs.readFileSync(SIDEBAR, 'utf8')
const groups = [...sidebar.matchAll(/^ {4}- group: (.+)$/gm)].map((match) => match[1] as string)
if (!groups.includes(group)) {
  fail(`no sidebar group \`${group}\`. Groups: ${groups.join(', ')}.`)
}
if (new RegExp(`^ +- title: ${title}$`, 'm').test(sidebar)) {
  fail(`the sidebar already has a page titled \`${title}\`.`)
}

// `src/index.ts`: the import goes after the last component import, the name at the end of the
// value `export { ... }` block, and the props type after the last component type export.
function insertAfterLast(source: string, pattern: RegExp, text: string, what: string): string {
  const matches = [...source.matchAll(pattern)]
  const last = matches[matches.length - 1]
  if (!last || last.index === undefined) fail(`can't find ${what} in \`src/index.ts\`.`)
  const end = last.index + last[0].length
  return source.slice(0, end) + text + source.slice(end)
}

// Searched only before the value export block: a multi-line `export type { ... }` below it also
// ends in a `} from './components/...'` line.
const exportsStart = index.search(/^export \{$/m)
if (exportsStart < 0) fail("can't find the `export { ... }` block.")
let nextIndex =
  insertAfterLast(
    index.slice(0, exportsStart),
    /^(import .*|\} )from '\.\/components\/[^']+'\n/gm,
    `import { ${pascal} } from './components/${kebab}'\n`,
    'the component imports'
  ) + index.slice(exportsStart)
const valueBlock = nextIndex.match(/^export \{\n[\s\S]*?\n\}\n/m)
if (!valueBlock || valueBlock.index === undefined) fail("can't find the `export { ... }` block.")
const blockEnd = valueBlock.index + valueBlock[0].length - '\n}\n'.length
nextIndex = `${nextIndex.slice(0, blockEnd)},\n  ${pascal}${nextIndex.slice(blockEnd)}`.replace(
  /,,\n/,
  ',\n'
)
nextIndex = insertAfterLast(
  nextIndex,
  /^export type .*from '\.\/components\/[^']+'\n/gm,
  `export type { ${pascal}Props } from './components/${kebab}'\n`,
  'the component type exports'
)

// `sidebar.yml`: the page goes last in its group.
const groupStart = sidebar.search(new RegExp(`^ {4}- group: ${group}\\n {6}pages:\\n`, 'm'))
const afterGroup = sidebar.slice(groupStart).match(/^ {4}- group: .+\n {6}pages:\n(?: {8}- .+\n)*/m)
if (!afterGroup) fail(`can't read the pages of sidebar group \`${group}\`.`)
const insertAt = groupStart + afterGroup[0].length
const nextSidebar = `${sidebar.slice(0, insertAt)}        - title: ${title}\n${sidebar.slice(insertAt)}`

for (const [file, content] of Object.entries(files)) {
  const target = path.join(ROOT, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content)
}
fs.writeFileSync(INDEX, nextIndex)
fs.writeFileSync(SIDEBAR, nextSidebar)

console.log(`Created ${pascal}:

${Object.keys(files)
  .map((file) => `  ${file}`)
  .join('\n')}

Edited:

  packages/react/src/index.ts       (import, value export, ${pascal}Props)
  packages/site/data/sidebar.yml    (${title}, under ${group})

Still to do:

  - Check chassis-css's markup and classes for the component first, and write the real one.
  - Fill in the docs page's description and sections (packages/site/WRITING.md).
  - A form component: read packages/react/FORMS.md; it needs renderFormField, not this body.
  - Styles of its own: a component-scoped .scss (packages/react/THEMING.md) and a visual
    regression spec (test/visual/).

Then run, from the repository root:

  pnpm react:check:types && pnpm test
  pnpm react:build                 # the docs site imports the built library; the build also
                                   # adds the ./${kebab} subpath to package.json's exports
  pnpm react:generate              # the prop table on the docs page
  pnpm react:check:api:update      # records the new exports in api-report.md
  pnpm changeset                   # minor: a new component
`)
