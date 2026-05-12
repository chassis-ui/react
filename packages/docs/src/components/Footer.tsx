import React, { FC } from 'react'
import { Link } from 'gatsby'
import pkg from './../../package.json'

const Footer: FC = () => {
  return (
    <footer className="cxd-footer py-6xlarge">
      <div className="container 2xlarge fg-subtle">
        <div className="row">
          <div className="medium:col-10 large:col-5 mb-medium">
            <Link
              className="d-inline-flex align-items-center mb-xsmall text-body-emphasis text-decoration-none"
              to="/"
              aria-label="Chassis React"
            >
              <img src="/images/site-logo.svg" alt="Chassis React" height="32" />
            </Link>
            <p>
              Chassis React components library. Licensed under the{' '}
              <a href="https://github.com/chassis-ui/react/blob/main/LICENSE" target="_blank" rel="license noopener">
                MIT License
              </a>
              . Currently v{pkg.version}.
            </p>
          </div>
          <div className="small:col-4 large:col-2 large:offset-1 mb-medium">
            <p className="h6 mb-xsmall">Docs</p>
            <ul className="nav">
              <li><Link to="/getting-started/introduction">Getting Started</Link></li>
              <li><Link to="/components/accordion">Components</Link></li>
            </ul>
          </div>
          <div className="small:col-4 large:col-2 mb-medium">
            <p className="h6 mb-xsmall">GitHub</p>
            <ul className="nav">
              <li><a href="https://github.com/chassis-ui/react" target="_blank" rel="noopener noreferrer">Chassis React</a></li>
              <li><a href="https://github.com/chassis-ui/react/issues" target="_blank" rel="noopener noreferrer">Issues</a></li>
              <li><a href="https://github.com/chassis-ui/react/discussions" target="_blank" rel="noopener noreferrer">Discussions</a></li>
            </ul>
          </div>
          <div className="small:col-4 large:col-2 mb-medium">
            <p className="h6 mb-xsmall">Project</p>
            <ul className="nav">
              <li><a href="https://chassis-ui.com" target="_blank" rel="noopener noreferrer">Chassis UI</a></li>
              <li><a href="https://github.com/chassis-ui" target="_blank" rel="noopener noreferrer">Contribute</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

Footer.displayName = 'Footer'

export default Footer
