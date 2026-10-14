import type { Preview } from '@storybook/react-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
// A consuming app is expected to load @chassis-ui/css itself (a peer dependency — see
// THEMING.md); Storybook has no such consumer, so it's imported directly here to render
// components with their real, intended appearance instead of unstyled markup. This package's own
// component-scoped CSS (Calendar/DatePicker/Notification/Table, etc.) needs no equivalent import:
// stories import components straight from `src/`, and each one already side-effect-imports its
// own source Sass/CSS file (e.g. Calendar.tsx's `import './Calendar.scss'`), which main.ts's
// `viteFinal` compiles live — importing the built `dist/style.css` on top would be redundant, and
// depends on a build having already run (see git history for why that's a real problem, not just
// a style nit).
import '@chassis-ui/css/dist/css/chassis.min.css'
import iconSprite from '@chassis-ui/icons/icons/chassis-icons.svg?raw'

// `Icon` references a sprite embedded in the page by default (`<use href="#name">`), the way the
// docs site and a consumer's page work, so Storybook embeds `@chassis-ui/icons`' sprite once.
// Without it every sprite icon renders as an empty box, and no screenshot could catch an icon
// regression. Done here rather than in `preview-body.html`, which the vitest `storybook` project
// never loads; the id keeps a hot reload from adding a second copy. The server render sweep
// (`test/ssr/`) imports this file with no `document`.
//
// In `<head>`, which `<use>` reaches by id like any part of the document: in `<body>` its 503
// symbols were walked by every `screen` query and accessibility check of every story, and the
// story tests took more than twice as long (RD26).
if (typeof document !== 'undefined' && !document.getElementById('cx-icon-sprite')) {
  const sprite = new DOMParser().parseFromString(iconSprite, 'image/svg+xml').documentElement
  sprite.id = 'cx-icon-sprite'
  sprite.setAttribute('aria-hidden', 'true')
  document.head.append(document.importNode(sprite, true))
}

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      codePanel: true,
      source: {
        excludeDecorators: true,
        transform: (code: string) => {
          // Removes <React.Fragment key={...}> and its closing tag </React.Fragment>
          return code
            .replace(/.*<React\.Fragment[^>]*>.*\n/gm, '')
            .replace(/<\/React\.Fragment>\n/gm, '')
        }
      }
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: 'light',
      attributeName: 'data-cx-theme'
    })
  ]
}

export default preview
