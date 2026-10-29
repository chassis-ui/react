// The files of `dist/project/` and one hash over all of them, so publishing can tell whether the
// tree it sends is the one `claude-design:check` passed.
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import { OUT, PROJECT } from './paths.ts'

export const CHECKED = path.join(OUT, 'checked.json')

export function walk(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
}

export const fileHash = (file: string) =>
  crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

export function treeHash(): string {
  const lines = walk(PROJECT)
    .map((f) => `${path.relative(PROJECT, f)} ${fileHash(f)}`)
    .sort()
  return crypto.createHash('sha256').update(lines.join('\n')).digest('hex')
}
