// The bundle's `?raw` imports load a file's text (bundle.ts, the `raw` namespace).
declare module '*?raw' {
  const text: string
  export default text
}
