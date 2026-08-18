import type { Preview } from '@storybook/react-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
// A consuming app is expected to load both stylesheets itself (@chassis-ui/css is a peer
// dependency, and this package's own compiled CSS isn't bundled into dist/index.js — see
// THEMING.md) — Storybook has no such consumer, so they're imported directly here to render
// components with their real, intended appearance instead of unstyled markup.
import '@chassis-ui/css/dist/css/chassis.min.css'
import '@chassis-ui/react/style.css'

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
