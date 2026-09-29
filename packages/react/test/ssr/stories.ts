import type { ComponentType } from 'react'
import fs from 'node:fs'
import path from 'node:path'

export type LoadedStory = { id: string; Story: ComponentType }

// Every story of every `stories/**/*.stories.tsx` file, composed with the Storybook preview's own
// annotations (decorators, default args), keyed `<family>/<File>.stories.tsx:<ExportName>`.
//
// Everything is imported dynamically, so a caller can load the stories, change the environment
// (install DOM globals), call `vi.resetModules()` and load them again: the second load evaluates
// React, the components and the stories afresh, the way a browser bundle would after the server's
// module graph rendered the HTML. See `hydrate.spec.tsx`.
export async function loadStories(): Promise<LoadedStory[]> {
  const { composeStories, setProjectAnnotations } = await import('@storybook/react-vite')
  const preview = (await import('../../.storybook/preview')).default
  setProjectAnnotations(preview)

  const root = path.resolve(__dirname, '../../stories')
  const files = fs
    .readdirSync(root, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.stories.tsx'))
    .sort()
  const stories: LoadedStory[] = []
  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const composed = composeStories((await import(path.join(root, file))) as any)
    for (const [name, Story] of Object.entries(composed)) {
      stories.push({
        id: `${file}:${name}`,
        Story: Story as unknown as ComponentType
      })
    }
  }
  return stories
}

// Shared by the allowlists of the specs in this folder and `test/utils/`: a known failure is
// expected to fail. When a later phase fixes it, the case starts passing, the "still fails" check
// fails, and the entry has to be deleted — so the allowlist can only shrink alongside real fixes.
export const STILL_FAILS =
  'is allowlisted as a known failure but now passes: delete its allowlist entry'
