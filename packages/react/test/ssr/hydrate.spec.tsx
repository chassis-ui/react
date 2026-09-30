// @vitest-environment node
import * as React from 'react'
import { renderToString } from 'react-dom/server'

import { installClientEnvironment } from './clientEnvironment'
import { loadFirstPaintCases } from './firstPaint'
import { loadStories, STILL_FAILS } from './stories'

// Hydration sweep: the server HTML of every story, and of every case in `firstPaint.tsx`, hydrated
// with `hydrateRoot`. A story fails if React reports a recoverable error, which is how it reports
// a hydration mismatch.
//
// Both halves run in this one file, in order. At collection time there is no DOM, so the module
// graph loaded first is a server's: `typeof window` is `'undefined'` inside every component, and
// the HTML is what a framework would send. `beforeAll` then installs a jsdom window as the global
// environment, resets the module graph, and loads the components and the stories again, now as a
// browser bundle would see them (see `clientEnvironment.ts`). Rendering the HTML under jsdom instead would hide exactly
// the `typeof window` branches that cause mismatches.

// Stories known to fail hydration, keyed by story id, each with the finding it belongs to. Empty
// since B1 of AUDIT-PLAN.md made every portal hydration-safe.
const KNOWN_FAILURES: Record<string, string> = {}

// Stories and first-paint cases alike, keyed by story id or `first paint: <case name>`.
const serverStories = [
  ...(await loadStories()),
  ...Object.entries(await loadFirstPaintCases()).map(([name, element]) => ({
    id: `first paint: ${name}`,
    Story: element as React.ComponentType
  }))
]
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
  await installClientEnvironment()
  const { loadStories: loadClientStories } = await import('./stories')
  const { loadFirstPaintCases: loadClientCases } = await import('./firstPaint')
  const clientCases = Object.entries(await loadClientCases()).map(
    ([name, element]) => [`first paint: ${name}`, element as React.ComponentType] as const
  )
  client = {
    React: await import('react'),
    hydrateRoot: (await import('react-dom/client')).hydrateRoot,
    stories: new Map([
      ...(await loadClientStories()).map(({ id, Story }) => [id, Story] as const),
      ...clientCases
    ])
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
