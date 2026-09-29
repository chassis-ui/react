// @vitest-environment node
import * as React from 'react'
import { renderToString } from 'react-dom/server'

import { loadStories } from './stories'

// Server render sweep: every story rendered with `renderToString` in a real Node environment, with
// no `window` or `document`, as a framework's server does. A story fails if rendering throws or
// logs a `console.error` (a `useLayoutEffect` on the server, an invalid prop, a missing key).
//
// No story fails today. A known failure would go in an allowlist keyed by story id, as in
// `hydrate.spec.tsx`.
const stories = await loadStories()

describe('server render of every story', () => {
  test('finds the stories', () => {
    expect(typeof window).toBe('undefined')
    expect(stories.length).toBeGreaterThan(250)
  })

  test.for(stories.map(({ id, Story }) => [id, Story] as const))('%s', ([, Story]) => {
    const errors: unknown[] = []
    const consoleError = vi.spyOn(console, 'error').mockImplementation((...args) => {
      errors.push(args[0])
    })
    try {
      expect(() => renderToString(<Story />)).not.toThrow()
    } finally {
      consoleError.mockRestore()
    }
    expect(errors).toEqual([])
  })
})
