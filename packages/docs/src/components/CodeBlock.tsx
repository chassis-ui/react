import React, { FC, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Highlight, { defaultProps } from 'prism-react-renderer'

// Mirror chassis-css example-mode.js: check localStorage first, then system preference
function getDocsTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme')
  if (stored && stored !== 'auto') return stored as 'light' | 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const CodeBlock: FC = ({ children }) => {
  const _children = children.props.children
  const language = children.props.className
    ? children.props.className.replace(/language-/, '')
    : 'jsx'

  const [copied, setCopied] = useState(false)
  const [exampleDark, setExampleDark] = useState(false)

  useEffect(() => {
    setExampleDark(getDocsTheme() === 'dark')
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(_children?.trim() ?? '')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = _children?.trim() ?? ''
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const codeBlock = e.currentTarget.closest('.cxd-code-block')
    const snippet = codeBlock?.previousElementSibling
    if (!snippet?.classList.contains('cxd-example-snippet')) return
    const example = snippet.querySelector<HTMLElement>('.cxd-example')
    if (!example) return

    const docsTheme = getDocsTheme()
    const current = example.getAttribute('data-cx-theme') || docsTheme
    const newTheme = current === 'dark' ? 'light' : 'dark'

    if (newTheme === docsTheme) {
      example.removeAttribute('data-cx-theme')
      setExampleDark(docsTheme === 'dark')
    } else {
      example.setAttribute('data-cx-theme', newTheme)
      setExampleDark(newTheme === 'dark')
    }
  }

  // Moon = currently light, click to go dark; Sun = currently dark, click to go light
  const themeIconHref = exampleDark ? '#sun-solid' : '#moon-solid'

  return (
    <div className="cxd-code-block">
      <div className="highlight-toolbar d-flex align-items-center ps-3 pe-1 py-1">
        <small className="font-monospace fg-subtle text-uppercase">{language}</small>
        <div className="d-flex ms-auto gap-1">
          <button type="button" className="button-mode" title="Toggle theme" onClick={handleThemeToggle}>
            <svg className="icon" aria-hidden="true">
              <use href={themeIconHref} />
            </svg>
          </button>
          <button
            type="button"
            className="button-clipboard"
            title={copied ? 'Copied!' : 'Copy to clipboard'}
            onClick={handleCopy}
          >
            <svg className="icon" aria-hidden="true">
              <use href={copied ? '#check-solid' : '#clipboard-outline'} />
            </svg>
          </button>
        </div>
      </div>
      <div className="highlight">
        <Highlight {...defaultProps} theme={undefined} code={_children?.trim()} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  <span className="line-no">{i + 1}</span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}

CodeBlock.propTypes = {
  children: PropTypes.any,
}

CodeBlock.displayName = 'CodeBlock'

export default CodeBlock
