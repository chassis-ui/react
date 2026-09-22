import { ComponentType, createContext, ReactElement } from 'react'

/**
 * The icons this library's own components draw, by purpose rather than by icon name — so a
 * consumer can map each one onto any icon set (see `IconProvider`'s `icons`).
 */
export type IconKey = 'check' | 'previous' | 'next' | 'menu' | 'play' | 'pause'

/**
 * An icon given to `IconProvider`'s `icons` or to a component's icon prop: a string is an icon
 * name, rendered by `IconProvider`'s `component` (or the built-in `Icon`); an element is rendered
 * as-is, with the component's own class names merged onto it.
 */
export type IconValue = string | ReactElement

/**
 * Props `IconProvider`'s `component` receives for every icon name it's asked to render.
 */
export interface IconComponentProps {
  /**
   * The icon name — an `IconValue` string, or `IconProvider`'s default for that icon.
   */
  name: string
  /**
   * The class names the rendering component needs on the icon (e.g. `menu-item-check`,
   * `directional-icon`) for chassis-css to position and flip it.
   */
  className?: string
  [prop: string]: unknown
}

export interface IconConfig {
  /**
   * Class names added to every `Icon`, alongside its own `icon` class.
   */
  className?: string
  /**
   * Replaces the built-in `Icon` for every icon this library's components render by name — the
   * strings in `icons` and their defaults, and a string `icon` on `Toast`/`Notification`. A
   * component reference can't be passed from a React Server Component, so set this in a
   * `'use client'` module.
   */
  component?: ComponentType<IconComponentProps>
  /**
   * Render `Icon` as an icon-font glyph instead of an SVG sprite reference, unless an `Icon` sets
   * `font` itself. Needs the icon font's stylesheet loaded.
   */
  font?: boolean
  /**
   * Class-name prefix of the icon font's glyphs: an icon named `check-solid` renders as
   * `{fontPrefix}check-solid`.
   *
   * @default 'cx-'
   */
  fontPrefix?: string
  /**
   * The icon to render for each of the library's own icons, by purpose. Unset ones keep their
   * defaults (`check-solid`, `chevron-left-outline`, `chevron-right-outline`, `bars-outline`,
   * `play-solid`, `pause-solid`).
   */
  icons?: Partial<Record<IconKey, IconValue>>
  /**
   * URL of the SVG sprite `Icon` references, e.g. `/static/icons/chassis-icons.svg`. Leave empty
   * (the default) when the sprite is embedded in the page, so icons render as `href="#name"`.
   * Browsers don't load an external sprite from another origin.
   *
   * @default ''
   */
  sprite?: string
}

// The chassis-icons names this library used before its icons became configurable. Both
// previous/next consumers (Pagination, Carousel) now share the outline chevrons — Pagination used
// the solid ones.
export const DEFAULT_ICONS: Record<IconKey, string> = {
  check: 'check-solid',
  previous: 'chevron-left-outline',
  next: 'chevron-right-outline',
  menu: 'bars-outline',
  play: 'play-solid',
  pause: 'pause-solid'
}

export const DEFAULT_FONT_PREFIX = 'cx-'

// Lives in `utils/` rather than `components/icon/` because it's read outside that folder too —
// by `IconSlot` (`./iconSlot.tsx`), which every icon-drawing component renders through.
export const IconContext = createContext<IconConfig>({})
