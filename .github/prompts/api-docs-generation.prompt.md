---
name: api-docs-generation
description: 'Phase 6 of chassis-react migration: set up automated API prop table generation using react-docgen-typescript, output to content collection, render via PropTable component. Run after Phase 5 (MDX content migration) is complete.'
---

# Phase 6 — API Docs Generation

**Prerequisite**: Phase 5 (MDX content migration) must be complete.  
**Check**: `.github/skills/react-migration/references/phase-status.md` Phase 5 = `[x]`  
**Completion marker**: Update Phase 6 status to `[x]` in phase-status.md

## Context

The old Gatsby docs used `react-docgen-typescript` in a `gatsby-node.js` build step to auto-generate prop tables from TypeScript interfaces. Every component interface has JSDoc comments on every prop — this is a high-quality source for documentation.

The new approach: a pre-build script extracts prop data to JSON files → Astro content collection → `<PropTable>` component renders them in MDX pages.

## Architecture

```
build/generate-api.ts           → runs at pre-build
  reads: packages/react/src/components/**/*.tsx
  uses:  react-docgen-typescript
  writes: packages/site/content/api/*.json  (one per component)

packages/site/src/content.config.ts
  → apiCollection: glob('../content/api/*.json')

packages/site/src/components/PropTable.astro
  → renders a table from the JSON data

MDX pages use:
import PropTable from '../../src/components/PropTable.astro'
<PropTable component="CxButton" />
```

## Step 1 — Create `build/generate-api.ts`

Location: `packages/react/build/generate-api.ts` (next to existing `build/` scripts, or at repo root `build/generate-api.ts`).

```ts
import * as path from 'path'
import * as fs from 'fs'
import { parse, withCustomConfig } from 'react-docgen-typescript'

const COMPONENTS_DIR = path.resolve(__dirname, '../packages/react/src/components')
const OUTPUT_DIR = path.resolve(__dirname, '../packages/site/content/api')

// Configure parser
const parser = withCustomConfig(
  path.resolve(__dirname, '../packages/react/tsconfig.json'),
  {
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: (prop) => {
      // Skip inherited HTML element props (too noisy)
      if (prop.parent) {
        return !prop.parent.fileName.includes('node_modules')
      }
      return true
    }
  }
)

// Find all component files
function findComponentFiles(dir: string): string[] {
  const results: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findComponentFiles(fullPath))
    } else if (entry.isFile() && entry.name.startsWith('Cx') && entry.name.endsWith('.tsx') && !entry.name.includes('spec') && !entry.name.includes('test')) {
      results.push(fullPath)
    }
  }
  return results
}

// Generate API data
fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const componentFiles = findComponentFiles(COMPONENTS_DIR)

for (const file of componentFiles) {
  try {
    const docs = parser.parse(file)
    for (const doc of docs) {
      if (!doc.displayName) continue
      const outputFile = path.join(OUTPUT_DIR, `${doc.displayName}.json`)
      fs.writeFileSync(outputFile, JSON.stringify(doc, null, 2))
      console.log(`Generated: ${doc.displayName}.json`)
    }
  } catch (e) {
    console.warn(`Skipped ${file}: ${e.message}`)
  }
}
```

## Step 2 — Add to `packages/react/package.json` build scripts

```json
"scripts": {
  "api": "ts-node build/generate-api.ts"
}
```

Or at the root level:
```json
"api:generate": "ts-node packages/react/build/generate-api.ts"
```

Add `ts-node` as a dev dep if not present.

## Step 3 — Add `api` content collection

In `packages/site/src/content.config.ts`, add:

```ts
import { file, glob } from 'astro/loaders'

// JSON schema for a single component's API data
const apiSchema = z.object({
  displayName: z.string(),
  description: z.string().optional(),
  props: z.record(z.object({
    name: z.string(),
    description: z.string(),
    type: z.object({ name: z.string() }),
    defaultValue: z.object({ value: z.string() }).nullable().optional(),
    required: z.boolean()
  }))
})

export const collections = {
  // ... existing docs collection ...
  api: defineCollection({
    loader: glob({ pattern: '*.json', base: '../content/api' }),
    schema: apiSchema
  })
}
```

## Step 4 — Create `PropTable.astro`

Location: `packages/site/src/components/PropTable.astro`

```astro
---
import { getEntry } from 'astro:content'

interface Props {
  component: string  // e.g. "CxButton"
}

const { component } = Astro.props
const entry = await getEntry('api', component)

if (!entry) {
  console.warn(`No API data found for component: ${component}`)
}

const props = entry ? Object.values(entry.data.props) : []
const sortedProps = props.sort((a, b) => a.name.localeCompare(b.name))
---

{entry ? (
  <div class="cxd-prop-table-wrapper">
    <table class="cxd-prop-table table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {sortedProps.map((prop) => (
          <tr>
            <td><code>{prop.name}{prop.required ? '' : '?'}</code></td>
            <td><code>{prop.type.name}</code></td>
            <td>{prop.defaultValue ? <code>{prop.defaultValue.value}</code> : <span>—</span>}</td>
            <td set:html={prop.description} />
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p class="text-muted">API documentation not available for {component}.</p>
)}
```

## Step 5 — Add `<PropTable>` usage to MDX files

At the bottom of each component MDX file, add:

```mdx
import PropTable from '../../src/components/PropTable.astro'

## API

<PropTable component="CxButton" />
```

For components with multiple sub-components (e.g., Modal has CxModal, CxModalHeader, etc.):
```mdx
<PropTable component="CxModal" />
<PropTable component="CxModalHeader" />
<PropTable component="CxModalBody" />
<PropTable component="CxModalFooter" />
```

## Step 6 — Wire into build pipeline

In root `package.json` scripts, run API generation before the site build:

```json
"docs:build": "pnpm --filter @chassis-ui/react api && pnpm --filter @chassis-ui/react-site build"
```

Or add as a pre-build step in `packages/site/package.json`:
```json
"prebuild": "ts-node ../../build/generate-api.ts"
```

## Step 7 — Run and verify

```sh
# Generate API JSON files
ts-node build/generate-api.ts

# Check output
ls packages/site/content/api/

# Build site
pnpm --filter @chassis-ui/react-site build
```

Spot-check: navigate to `/react/components/button/` — prop table should render with all CxButton props.

## Step 8 — Mark complete

Update phase-status.md Phase 6 to `[x]`.

## Verification Checklist

- [ ] `build/generate-api.ts` runs without errors
- [ ] `packages/site/content/api/` contains JSON files for all Cx* components
- [ ] `CxButton.json` contains all props with descriptions
- [ ] `CxModal.json` contains all props with descriptions
- [ ] `PropTable.astro` renders a table with Prop/Type/Default/Description columns
- [ ] Button component page shows API table
- [ ] Modal component page shows API table for all sub-components
- [ ] Build succeeds end-to-end
