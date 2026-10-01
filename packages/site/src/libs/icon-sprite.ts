import type { AstroIntegration } from 'astro'
import type { ChassisConfig } from '@chassis-ui/docs/schema'

// `@chassis-ui/react`'s `Icon` references a sprite embedded in the page by default (`href="#name"`),
// and every live example on this site is its own React island — its own root, so no single
// `IconProvider` could wrap them all to point them at an external sprite file instead. So the site
// embeds the sprite itself, once per page: fetched (and browser-cached) from the same file the
// docs chrome already references, then inserted as a hidden element at the top of `<body>`. A
// `<use href="#name">` that rendered before the sprite arrived picks its symbol up as soon as it
// lands — the same way a consumer's page with an inlined sprite works, which is what the examples
// should demonstrate.
const SPRITE_FILE = 'icons/chassis-icons.svg'

const getScript = (spriteUrl: string) => `
fetch(${JSON.stringify(spriteUrl)})
  .then((response) => (response.ok ? response.text() : ''))
  .then((svg) => {
    if (!svg) return
    const holder = document.createElement('div')
    holder.setAttribute('aria-hidden', 'true')
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
    holder.innerHTML = svg
    document.body.prepend(holder)
  })
`

export function iconSprite({ config }: { config: ChassisConfig }): AstroIntegration {
  const script = getScript(`${config.staticPath ?? '/static'}/${SPRITE_FILE}`)

  return {
    name: 'chassis-react-icon-sprite',
    hooks: {
      'astro:config:setup': ({ injectScript }) => injectScript('page', script)
    }
  }
}
