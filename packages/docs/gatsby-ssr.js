import React from 'react'
import fs from 'fs'
import path from 'path'

// Inline script to apply stored theme before first paint (prevents flash)
const themeInitScript = `
;(function() {
  var storedTheme = localStorage.getItem('theme')
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  var theme = storedTheme || 'auto'
  document.documentElement.setAttribute('data-cx-theme', theme === 'auto'
    ? (prefersDark ? 'dark' : 'light')
    : theme)
})()
`

// Read SVG sprite at build/SSR time so it survives React hydration
let svgSprite = ''
try {
  svgSprite = fs.readFileSync(path.join(__dirname, '../static/icons/chassis-icons.svg'), 'utf8')
} catch (e) {
  console.warn('[gatsby-ssr] Could not read chassis-icons.svg:', e.message)
}

export const onRenderBody = ({ setHeadComponents, setPreBodyComponents, setPostBodyComponents }) => {
  setHeadComponents([
    <script
      key="theme-init"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />,
    <link key="chassis-css" rel="stylesheet" href="/css/chassis.css" />,
  ])

  if (svgSprite) {
    setPreBodyComponents([
      <div
        key="chassis-icons"
        id="chassis-icons-sprite"
        aria-hidden="true"
        style={{ display: 'none' }}
        dangerouslySetInnerHTML={{ __html: svgSprite }}
      />,
    ])
  }

  setPostBodyComponents([
    <script key="color-modes" src="/js/color-modes.js" />,
    // chassis.bundle.js is ESM format — requires type="module"
    <script key="chassis-js" type="module" src="/js/chassis.bundle.js" />,
  ])
}
