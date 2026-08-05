import type { Preview } from '@storybook/react-vite'
// A consuming app is expected to load this stylesheet itself (@chassis-ui/css is a peer
// dependency, see THEMING.md) — Storybook has no such consumer, so it's imported directly here
// to render components with their real, intended appearance instead of unstyled markup.
import '@chassis-ui/css/dist/css/chassis.min.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
