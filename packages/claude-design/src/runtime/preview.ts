// The preview runtime, bundled into components/bundle.js as `ChassisReact.__preview`. Each
// components/<Comp>/preview.html calls `mount('<Comp>')`, which renders that component's
// Storybook stories into the preview frame, so a card shows what the stories (and their visual
// regression screenshots) show.
//
// Stories are composed the way Storybook composes them: meta args under story args, argTypes
// mappings applied, `story.render`, then `meta.render`, then the component itself, wrapped by the
// story's decorators and then meta's. `play` functions are not run: a card shows the resting
// state.
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import sprite from '@chassis-ui/icons/icons/chassis-icons.svg?raw'

// The default brand's id, which bundle.ts defines from DEFAULT_BRAND (paths.ts).
declare const __DEFAULT_BRAND__: string

type Args = Record<string, unknown>
type Decorator = (story: React.ComponentType, context: Context) => React.ReactNode
interface Meta {
  title?: string
  component?: React.ComponentType<Args>
  args?: Args
  argTypes?: Record<string, { mapping?: Record<string, unknown> }>
  parameters?: Record<string, unknown>
  decorators?: Decorator[]
  render?: (args: Args, context: Context) => React.ReactNode
}
type Story = (Meta & { name?: string }) | ((args: Args, context: Context) => React.ReactNode)
interface Context {
  args: Args
  argTypes: Record<string, unknown>
  parameters: Record<string, unknown>
  globals: Record<string, unknown>
  id: string
  name: string
  title: string
  viewMode: 'story'
  loaded: Record<string, unknown>
}
export interface StoryModule {
  default: Meta
  [name: string]: unknown
}
export interface Card {
  // How the card lays the stories out: a grid of labelled cells, a column of full-width rows, or
  // one story alone (overlays that portal out of a cell, or fixed-position ones).
  mode: 'grid' | 'column' | 'single'
  primary?: string
  skip?: string[]
}

function ensureSprite() {
  if (document.getElementById('cx-icon-sprite')) return
  const svg = new DOMParser().parseFromString(sprite, 'image/svg+xml').documentElement
  svg.id = 'cx-icon-sprite'
  svg.setAttribute('aria-hidden', 'true')
  document.head.append(document.importNode(svg, true))
}

// The page sets `<html data-theme="<brand>-<mode>">` from its theme switcher; chassis-css reads
// `data-cx-brand` and `data-cx-theme`.
export function followTheme() {
  const html = document.documentElement
  const apply = () => {
    const [brand, mode] = (html.getAttribute('data-theme') ?? `${__DEFAULT_BRAND__}-light`).split(
      '-'
    )
    html.setAttribute('data-cx-brand', brand || __DEFAULT_BRAND__)
    html.setAttribute('data-cx-theme', mode === 'dark' ? 'dark' : 'light')
  }
  apply()
  new MutationObserver(apply).observe(html, { attributes: true, attributeFilter: ['data-theme'] })
}

function compose(
  meta: Meta,
  key: string,
  story: Story
): { name: string; element: React.ReactElement } {
  const s: Meta & { name?: string } = typeof story === 'function' ? { render: story } : story
  const args: Args = { ...meta.args, ...s.args }
  const argTypes = { ...meta.argTypes, ...s.argTypes }
  for (const [k, t] of Object.entries(argTypes)) {
    const mapping = t?.mapping
    if (mapping && typeof args[k] === 'string' && (args[k] as string) in mapping)
      args[k] = mapping[args[k] as string]
  }
  const name = s.name ?? key.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  const context: Context = {
    args,
    argTypes,
    parameters: { ...meta.parameters, ...s.parameters },
    globals: { theme: document.documentElement.getAttribute('data-cx-theme') ?? 'light' },
    id: `${meta.title ?? ''}--${key}`.toLowerCase(),
    name,
    title: meta.title ?? '',
    viewMode: 'story',
    loaded: {}
  }
  const render =
    s.render ??
    meta.render ??
    ((a: Args) => (meta.component ? React.createElement(meta.component, a) : null))
  let inner: (ctx: Context) => React.ReactNode = (ctx) => render(ctx.args, ctx)
  for (const decorator of [...(s.decorators ?? []), ...(meta.decorators ?? [])]) {
    const below = inner
    // The story under a decorator is a component, so hooks in a story's render run in their own.
    const Below = () => React.createElement(React.Fragment, null, below(context))
    inner = (ctx) => decorator(Below, ctx)
  }
  const Root = () => React.createElement(React.Fragment, null, inner(context))
  return { name, element: React.createElement(Root, { key }) }
}

function stories(modules: StoryModule[], card: Card) {
  const out: { name: string; element: React.ReactElement }[] = []
  for (const mod of modules) {
    const order = (mod.__namedExportsOrder as string[] | undefined) ?? Object.keys(mod)
    for (const key of order) {
      if (key === 'default' || key === '__namedExportsOrder') continue
      const story = mod[key] as Story
      if (!story || (typeof story !== 'object' && typeof story !== 'function')) continue
      if (card.skip?.includes(key)) continue
      out.push(compose(mod.default, key, story))
    }
  }
  if (card.mode === 'single') {
    const pick = card.primary ? out.find((s) => s.element.key === card.primary) : out[0]
    // A primary story that was renamed must fail the check, not show another story.
    if (!pick) throw new Error(`ChassisReact.__preview: no story ${card.primary}`)
    return [pick]
  }
  return out
}

// A caption above each story, in the system's own subtle text.
const caption = (text: string) =>
  React.createElement(
    'div',
    { className: 'font-xs fg-subtle mb-2xs', style: { fontFamily: 'var(--cx-font-family-ui)' } },
    text
  )

export function mount(
  registry: Record<string, { modules: StoryModule[]; card: Card }>,
  name: string,
  el?: HTMLElement
) {
  const entry = registry[name]
  const root = el ?? document.getElementById('root')
  if (!entry || !root) throw new Error(`ChassisReact.__preview: no stories for ${name}`)
  ensureSprite()
  followTheme()
  document.body.classList.add('bg-main', 'fg-main')
  const list = stories(entry.modules, entry.card)
  const cell = (s: { name: string; element: React.ReactElement }) =>
    React.createElement(
      'section',
      // `data-story` marks where a story renders, for claude-design:check.
      { key: s.name, 'data-story': '', style: { minWidth: 0 } },
      caption(s.name),
      s.element
    )
  const body =
    entry.card.mode === 'single'
      ? React.createElement('div', { className: 'p-md', 'data-story': '' }, list[0]?.element)
      : React.createElement(
          'div',
          {
            className: 'p-md',
            style:
              entry.card.mode === 'grid'
                ? {
                    display: 'grid',
                    gap: '1.5rem',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
                    alignItems: 'start'
                  }
                : { display: 'flex', flexDirection: 'column', gap: '1.5rem' }
          },
          list.map(cell)
        )
  createRoot(root).render(body)
}
