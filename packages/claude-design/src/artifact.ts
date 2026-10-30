// The system's index, `project/design-system.json`.
//
// `artifact.json` holds what the artifact keeps between syncs: its url, and the `createdOnFiles`
// marker the page wrote the index under, which every later index must carry as it is.
import * as fs from 'fs'
import * as path from 'path'
import { execFileSync } from 'child_process'
import { NAMESPACE, PACKAGE, PROJECT, REACT, REACT_MODULES, ROOT, TITLE } from './paths.ts'

export interface ArtifactConfig {
  url: string
  createdOnFiles: { v: number; at: string }
}

export const artifactConfig = (): ArtifactConfig =>
  JSON.parse(fs.readFileSync(path.join(PACKAGE, 'artifact.json'), 'utf8'))

const git = (...args: string[]) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim()
// A git query that has no answer here (an unset key, no tag) exits non-zero: that is ''.
const gitOr = (...args: string[]) => {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return ''
  }
}
const version = (dir: string) =>
  JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version as string

// What a sync records about itself: the commit and the versions it was built from.
export function provenance() {
  const sha = git('rev-parse', '--short', 'HEAD')
  const dirty = git('status', '--porcelain').length > 0
  // A branch, or on the detached checkout of a release the tag it is at.
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD')
  const at = branch !== 'HEAD' ? branch : gitOr('describe', '--tags', '--exact-match') || 'detached'
  return {
    sha,
    ref: `${at}@${sha}${dirty ? '+local changes' : ''}`,
    by: gitOr('config', 'user.name') || 'Claude',
    react: version(REACT),
    css: version(path.join(REACT_MODULES, '@chassis-ui/css')),
    tokens: version(path.join(REACT_MODULES, '@chassis-ui/website-tokens'))
  }
}

export function writeIndex(
  config: ArtifactConfig,
  prov: ReturnType<typeof provenance>,
  note: string
) {
  const react = version(path.join(REACT_MODULES, 'react'))
  const index = {
    v: 3,
    layout: 'files',
    createdOnFiles: config.createdOnFiles,
    title: TITLE,
    namespace: NAMESPACE,
    // Synced from code: the page opens read-only, so nothing edited there is lost to the next sync.
    editing: 'code',
    libraries: [
      { name: 'react', version: react, global: 'React', file: 'components/lib/react.js' },
      { name: 'react-dom', version: react, global: 'ReactDOM', file: 'components/lib/react-dom.js' }
    ],
    sections: {},
    // A design system of a component library: a project brings its own logos and images.
    groups: [],
    assetGroups: {},
    blobs: {},
    docs: { sections: [] },
    lastChange: {
      by: prov.by,
      at: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
      via: `Claude Code · chassis-ui/react@${prov.sha}`,
      note
    }
  }
  fs.writeFileSync(path.join(PROJECT, 'design-system.json'), JSON.stringify(index, null, 2) + '\n')
}
