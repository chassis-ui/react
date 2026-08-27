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
