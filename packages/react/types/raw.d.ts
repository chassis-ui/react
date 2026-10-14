// Vite's `?raw` suffix imports a file as a string. `.storybook/preview.tsx` reads the icon sprite
// that way; Vite's own `vite/client` types would declare it, but `vite` isn't a direct dependency
// of this package, so this declares the one suffix in use.
declare module '*.svg?raw' {
  const content: string
  export default content
}
