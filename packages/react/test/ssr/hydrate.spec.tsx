// @vitest-environment node
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { builtinEnvironments } from 'vitest/environments'

import { loadStories, STILL_FAILS } from './stories'

// Hydration sweep: the server HTML of every story, hydrated with `hydrateRoot`. A story fails if
// React reports a recoverable error, which is how it reports a hydration mismatch.
//
// Both halves run in this one file, in order. At collection time there is no DOM, so the module
// graph loaded first is a server's: `typeof window` is `'undefined'` inside every component, and
// the HTML is what a framework would send. `beforeAll` then installs a jsdom window as the global
// environment, resets the module graph, and loads React, the components and the stories again —
// now as a browser bundle would see them. Rendering the HTML under jsdom instead would hide exactly
// the `typeof window` branches that cause mismatches.

// F1 of AUDIT-PLAN.md: a portal rendered during hydration (`typeof window !== 'undefined' &&
// createPortal(...)`) renders nothing on the server and the portal's content on the client's first
// render. B1 fixes these; delete each entry with its fix.
const KNOWN_FAILURES: Record<string, string> = {
  'autocomplete/Autocomplete.stories.tsx:Default': 'F1: portaled menu',
  'autocomplete/Autocomplete.stories.tsx:Disabled': 'F1: portaled menu',
  'autocomplete/Autocomplete.stories.tsx:Grouped': 'F1: portaled menu',
  'autocomplete/Autocomplete.stories.tsx:Items': 'F1: portaled menu',
  'autocomplete/Autocomplete.stories.tsx:Multiple': 'F1: portaled menu',
  'autocomplete/Autocomplete.stories.tsx:OpenMenu': 'F1: portaled menu',
  'autocomplete/Autocomplete.stories.tsx:WithFormField': 'F1: portaled menu',
  'combobox/Combobox.stories.tsx:Default': 'F1: portaled menu',
  'combobox/Combobox.stories.tsx:Disabled': 'F1: portaled menu',
  'combobox/Combobox.stories.tsx:Grouped': 'F1: portaled menu',
  'combobox/Combobox.stories.tsx:Items': 'F1: portaled menu',
  'combobox/Combobox.stories.tsx:OpenMenu': 'F1: portaled menu',
  'combobox/Combobox.stories.tsx:WithFormField': 'F1: portaled menu',
  'form-field/FormField.stories.tsx:WrappedControl': 'F1: wraps a Combobox',
  'popover/Popover.stories.tsx:Open': 'F1: open on first render',
  'popover/Popover.stories.tsx:OpenNoTitle': 'F1: open on first render',
  'popover/Popover.stories.tsx:OpenPlacementLeft': 'F1: open on first render'
}

const serverStories = await loadStories()
const serverHtml = new Map(
  serverStories.map(({ id, Story }) => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    try {
      return [id, renderToString(<Story />)] as const
    } finally {
      consoleError.mockRestore()
    }
  })
)

type Client = {
  React: typeof import('react')
  hydrateRoot: typeof import('react-dom/client').hydrateRoot
  stories: Map<string, React.ComponentType>
}
let client: Client

beforeAll(async () => {
  // The same jsdom window the rest of the suite gets from `environment: 'jsdom'`.
  await builtinEnvironments.jsdom.setup(globalThis, { jsdom: { url: 'http://localhost/' } })
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

  vi.resetModules()
  // The project's setup file already ran this before a DOM existed, when it had nothing to patch.
  await import('../dialogPolyfill')
  const { loadStories: loadClientStories } = await import('./stories')
  client = {
    React: await import('react'),
    hydrateRoot: (await import('react-dom/client')).hydrateRoot,
    stories: new Map((await loadClientStories()).map(({ id, Story }) => [id, Story]))
  }
}, 60_000)

async function hydrate(id: string): Promise<string[]> {
  const { React: ClientReact, hydrateRoot } = client
  const Story = client.stories.get(id)!
  const errors: string[] = []

  document.body.innerHTML = ''
  const host = document.createElement('div')
  host.innerHTML = serverHtml.get(id)!
  document.body.appendChild(host)

  // React also logs each mismatch; the recoverable error is what's asserted on.
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  try {
    let root: ReturnType<typeof hydrateRoot> | undefined
    await ClientReact.act(async () => {
      root = hydrateRoot(host, ClientReact.createElement(Story), {
        onRecoverableError: (error) => {
          errors.push(error instanceof Error ? error.message : String(error))
        }
      })
    })
    await ClientReact.act(async () => root?.unmount())
  } finally {
    consoleError.mockRestore()
  }
  return errors
}

describe('hydration of every story', () => {
  test('lists only stories that exist', () => {
    const ids = new Set(serverStories.map(({ id }) => id))
    expect(Object.keys(KNOWN_FAILURES).filter((id) => !ids.has(id))).toEqual([])
  })

  test.for(serverStories.map(({ id }) => id))('%s', async (id) => {
    const errors = await hydrate(id)
    if (id in KNOWN_FAILURES) {
      expect(errors, `${id} ${STILL_FAILS}`).not.toEqual([])
    } else {
      expect(errors).toEqual([])
    }
  })
})
