import React, { FC } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'

const Header: FC = () => {
  return (
    <header className="navbar large:navbar-expand cxd-navbar sticky-top">
      <nav className="container 2xlarge" aria-label="Main navigation">
        {/* Sidebar toggle (docs layout only) */}
        <div className="cxd-navbar-toggle">
          <button
            className="navbar-toggler p-xsmall2"
            type="button"
            data-cx-toggle="drawer"
            data-cx-target="#cxdSidebar"
            aria-controls="cxdSidebar"
            aria-label="Toggle docs navigation"
          >
            <svg className="icon icon-large" aria-hidden="true">
              <use href="#bars-solid" />
            </svg>
            <span className="d-none large:d-inline fs-6 pe-2xsmall">Browse</span>
          </button>
        </div>

        <Link className="navbar-brand large:me-medium" to="/" aria-label="Chassis React">
          <img src="/images/site-logo.svg" alt="Chassis React" width="123" height="32" />
        </Link>

        <div className="d-flex">
          <button
            className="navbar-toggler d-flex large:d-none order-3 p-xsmall"
            type="button"
            data-cx-toggle="drawer"
            data-cx-target="#cxdNavbar"
            aria-controls="cxdNavbar"
            aria-label="Toggle navigation"
          >
            <svg className="icon" aria-hidden="true">
              <use href="#ellipsis-h-solid" />
            </svg>
          </button>
        </div>

        <dialog
          className="drawer dialog large:drawer drawer-end flex-grow-1"
          id="cxdNavbar"
          aria-labelledby="cxdNavbarOffcanvasLabel"
        >
          <div className="drawer-header px-large pb-0">
            <h5 className="drawer-title" id="cxdNavbarOffcanvasLabel">Chassis React</h5>
            <button
              type="button"
              className="close-button"
              data-cx-dismiss="drawer"
              aria-label="Close"
              data-cx-target="#cxdNavbar"
            />
          </div>

          <div className="drawer-body p-large pt-0 large:p-0">
            <hr className="large:d-none" />
            <ul className="navbar-nav flex-row flex-wrap mx-0 large:mx-medium">
              <li className="nav-item">
                <Link className="nav-link" to="/" activeClassName="active">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/getting-started/introduction/" activeClassName="active" partiallyActive>Docs</Link>
              </li>
            </ul>

            <hr className="large:d-none" />

            <ul className="navbar-nav flex-row flex-wrap medium:ms-auto align-items-center">
              <li className="nav-item">
                <a
                  className="nav-link px-0 large:px-small"
                  href="https://github.com/chassis-ui/react"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="icon" aria-label="GitHub" role="img">
                    <use href="#github-brand" />
                  </svg>
                  <small className="d-none ms-xsmall">GitHub</small>
                </a>
              </li>
              <li className="nav-item col-12 large:col-auto">
                <div className="vr d-none large:d-flex h-100 large:mx-small" />
                <hr className="large:d-none" />
              </li>
              <li className="nav-item" id="cxd-theme-container">
                {/* ThemeToggler rendered via portal or inline script — see ThemeToggler component */}
                <button
                  className="nav-link"
                  id="cxd-theme"
                  type="button"
                  aria-expanded="false"
                  data-cx-toggle="menu"
                  aria-label="Toggle theme (auto)"
                >
                  <svg className="icon theme-icon-active" aria-hidden="true">
                    <use href="#circle-half-solid" />
                  </svg>
                  <span className="large:d-none ms-xsmall" id="cxd-theme-text">Toggle theme</span>
                </button>
                <ul className="menu" aria-labelledby="cxd-theme-text">
                  <li>
                    <button type="button" className="menu-item d-flex align-items-center" data-cx-theme-value="light" aria-pressed="false">
                      <svg className="icon icon-reset me-xsmall" aria-hidden="true"><use href="#sun-solid" /></svg>
                      Light
                      <svg className="icon ms-auto d-none" aria-hidden="true"><use href="#check-solid" /></svg>
                    </button>
                  </li>
                  <li>
                    <button type="button" className="menu-item d-flex align-items-center" data-cx-theme-value="dark" aria-pressed="false">
                      <svg className="icon icon-reset me-xsmall" aria-hidden="true"><use href="#moon-stars-solid" /></svg>
                      Dark
                      <svg className="icon ms-auto d-none" aria-hidden="true"><use href="#check-solid" /></svg>
                    </button>
                  </li>
                  <li>
                    <button type="button" className="menu-item d-flex align-items-center active" data-cx-theme-value="auto" aria-pressed="true">
                      <svg className="icon icon-reset me-xsmall" aria-hidden="true"><use href="#circle-half-solid" /></svg>
                      Auto
                      <svg className="icon ms-auto d-none" aria-hidden="true"><use href="#check-solid" /></svg>
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </dialog>
      </nav>
    </header>
  )
}

Header.displayName = 'Header'

export default Header
