// Where the Claude Design build reads from and writes to. Every input is resolved from the
// workspace, never from a published package on npm, so one commit always builds the same system.
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const SRC = __dirname
export const PACKAGE = path.resolve(__dirname, '..')
// The committed text the build fills in: the system README, the cover, the publish prompt.
export const CONTENT = path.join(PACKAGE, 'content')
export const ROOT = path.resolve(__dirname, '../../..')
export const REACT = path.join(ROOT, 'packages/react')
export const SITE = path.join(ROOT, 'packages/site')
// The react package's own node_modules: pnpm keeps react, the chassis packages and the story
// dependencies there, not at the root.
export const REACT_MODULES = path.join(REACT, 'node_modules')
export const CHASSIS_CSS = path.join(REACT_MODULES, '@chassis-ui/css')
export const CHASSIS_TOKENS = path.join(REACT_MODULES, '@chassis-ui/tokens')
export const CHASSIS_ICONS = path.join(REACT_MODULES, '@chassis-ui/icons')
export const ASSETS = path.join(ROOT, 'vendor/assets')

// `dist/project/` mirrors the artifact's `project/` folder file for file, so the publish step sends
// the tree as it is. `dist/work/` holds intermediate files.
export const OUT = path.join(PACKAGE, 'dist')
export const PROJECT = path.join(OUT, 'project')
export const WORK = path.join(OUT, 'work')

// The brands of the system, the only place they are named (AGENTS.md, "Adding a brand"). Each needs
// its tokens in `@chassis-ui/tokens` and its fonts in the assets.
export const BRANDS = ['chassis', 'sinefil'] as const
export type Brand = (typeof BRANDS)[number]
// The brand on `:root`; every other brand is a layer an element opts into. It must be the token set
// chassis-css compiles by default: the control check compares its compile with chassis.css.
export const DEFAULT_BRAND: Brand = 'chassis'
export const BRAND_NAMES: Record<Brand, string> = { chassis: 'Chassis', sinefil: 'Sinefil' }

// The brands' names as prose: "A", "A and B", "A, B and C".
export const brandList = () => {
  const names = BRANDS.map((b) => BRAND_NAMES[b])
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0]
}
export const MODES = ['light', 'dark'] as const
export type Mode = (typeof MODES)[number]

export const TITLE = 'Chassis React'
export const NAMESPACE = 'ChassisReact'
