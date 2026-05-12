// Helper to detect the user's preferred theme
function getPreferredTheme() {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme && storedTheme !== 'auto') {
    return storedTheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Direct theme toggle — globally accessible via onclick="toggleTheme(this)"
function toggleTheme(button) {
  const example = button.closest('.cxd-example-snippet').querySelector('.cxd-example')
  if (!example) return

  let currentTheme = example.getAttribute('data-cx-theme')
  if (!currentTheme) {
    currentTheme = getPreferredTheme()
  }

  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  const preferredTheme = getPreferredTheme()

  if (newTheme === preferredTheme) {
    example.removeAttribute('data-cx-theme')
  } else {
    example.setAttribute('data-cx-theme', newTheme)
  }

  const iconUse = button.querySelector('use')
  if (iconUse) {
    iconUse.setAttribute('xlink:href', newTheme === 'dark' ? '#sun-solid' : '#moon-solid')
  }
}

// StackBlitz opener
function openInStackBlitz(code) {
  const exportNames = (code.match(/export (?:const|function) ([A-Z][a-zA-Z0-9]*)/g) || []).map(
    (m) => m.replace(/export (?:const|function) /, '')
  )

  const appJsx = [
    "import React from 'react'",
    "import '@chassis-ui/css/dist/chassis.min.css'",
    '',
    code.trim(),
    '',
    "import { createRoot } from 'react-dom/client'",
    exportNames.length
      ? `const RootComponent = ${exportNames[0]}`
      : "const RootComponent = () => React.createElement('p', null, 'No component exported')",
    "createRoot(document.getElementById('root')).render(React.createElement(RootComponent))",
  ].join('\n')

  const fields = {
    'project[title]': 'Chassis React Example',
    'project[description]': 'Chassis React component example',
    'project[template]': 'node',
    'project[files][index.html]': [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '  <head>',
      '    <meta charset="utf-8">',
      '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      '    <title>Chassis React Example</title>',
      '  </head>',
      '  <body>',
      '    <div id="root" class="p-4"></div>',
      '    <script type="module" src="/src/App.jsx"></script>',
      '  </body>',
      '</html>',
    ].join('\n'),
    'project[files][vite.config.js]': [
      "import { defineConfig } from 'vite'",
      "import react from '@vitejs/plugin-react'",
      'export default defineConfig({ plugins: [react()] })',
    ].join('\n'),
    'project[files][package.json]': JSON.stringify(
      {
        name: 'chassis-react-example',
        private: true,
        type: 'module',
        scripts: { dev: 'vite', build: 'vite build' },
        dependencies: {
          react: '^18',
          'react-dom': '^18',
          '@chassis-ui/react': 'latest',
          '@chassis-ui/css': 'latest',
        },
        devDependencies: {
          vite: '^5',
          '@vitejs/plugin-react': '^4',
        },
      },
      null,
      2
    ),
    'project[files][src/App.jsx]': appJsx,
  }

  const form = document.createElement('form')
  form.method = 'POST'
  form.action = 'https://stackblitz.com/run'
  form.target = '_blank'
  form.rel = 'noopener'

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

document.addEventListener('DOMContentLoaded', () => {
  const preferredTheme = getPreferredTheme()

  // Adopt adjacent code snippets into each example-snippet wrapper.
  // Move .highlight directly (not the cxd-code-snippet wrapper) so the structure
  // matches chassis-css: cxd-example-snippet.cxd-code-snippet > .highlight
  document.querySelectorAll('.cxd-example-snippet').forEach((snippet) => {
    // Skip if already has a .highlight child
    if (snippet.querySelector(':scope > .highlight')) return

    // Skip SCRIPT siblings (Astro injects hydration scripts between elements)
    let next = snippet.nextElementSibling
    while (next && next.tagName === 'SCRIPT') {
      next = next.nextElementSibling
    }
    if (!next || !next.classList.contains('cxd-code-snippet')) return

    // Move .highlight directly into the snippet, discard the cxd-code-snippet wrapper
    const highlight = next.querySelector('.highlight')
    if (highlight) {
      snippet.appendChild(highlight)
    }
    next.remove()
  })

  // Initialize .button-mode icon and tooltip
  document.querySelectorAll('.button-mode').forEach((button) => {
    if (window.chassis && window.chassis.Tooltip) {
      window.chassis.Tooltip.getOrCreateInstance(button)
    }

    const iconUse = button.querySelector('use')
    if (iconUse) {
      const example = button.closest('.cxd-example-snippet')?.querySelector('.cxd-example')
      const currentTheme = example?.getAttribute('data-cx-theme') || preferredTheme
      iconUse.setAttribute('xlink:href', currentTheme === 'dark' ? '#sun-solid' : '#moon-solid')
    }

    // Fallback listener for buttons without onclick attribute
    if (!button.hasAttribute('onclick')) {
      button.addEventListener('click', () => toggleTheme(button))
    }
  })

  // Wire StackBlitz buttons
  document.querySelectorAll('.button-edit').forEach((button) => {
    if (window.chassis && window.chassis.Tooltip) {
      window.chassis.Tooltip.getOrCreateInstance(button)
    }

    button.addEventListener('click', () => {
      const snippet = button.closest('.cxd-example-snippet')
      const code = snippet?.querySelector('.highlight')?.textContent?.trim() ?? ''
      if (code) openInStackBlitz(code)
    })
  })
})
