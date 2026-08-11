import type { Preview } from '@storybook/react-vite'
// A consuming app is expected to load both stylesheets itself (@chassis-ui/css is a peer
// dependency, and this package's own compiled CSS isn't bundled into dist/index.js — see
// THEMING.md) — Storybook has no such consumer, so they're imported directly here to render
// components with their real, intended appearance instead of unstyled markup.
import '@chassis-ui/css/dist/css/chassis.min.css'
import '@chassis-ui/react/style.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
