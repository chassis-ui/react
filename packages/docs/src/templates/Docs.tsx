import React, { FC, useState } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { Callout, CodeBlock, Example, Footer, Header, Seo, Sidebar, Toc } from './../components/'
import { CxTable } from '@chassis-ui/react/src/index'
import './../scss/docs.scss'

interface ContextProps {
  sidebarVisible: boolean | undefined
  setSidebarVisible: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export const myContext = React.createContext({} as ContextProps)

const components = {
  // eslint-disable-next-line react/display-name
  pre: (props) => <CodeBlock {...props} />,
  // eslint-disable-next-line react/display-name
  table: (props) => <CxTable responsive {...props} className="table striped table-api" />,
  Callout,
  Example,
}

const DocsLayout: FC = ({ data: { mdx }, location }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const hasToc = mdx.tableOfContents?.items?.length > 0

  return (
    <>
      <Seo title={mdx.frontmatter.title} description={mdx.frontmatter.description} />
      <myContext.Provider value={{ sidebarVisible, setSidebarVisible }}>
        <div className="docs-body" data-cx-spy={hasToc ? 'scroll' : undefined} data-cx-target={hasToc ? '#TableOfContents' : undefined}>
          <div className="skippy visually-hidden-focusable overflow-hidden">
            <div className="container xlarge">
              <a className="d-inline-flex p-xsmall m-xsmall" href="#content">Skip to main content</a>
              <a className="d-inline-flex p-xsmall m-xsmall" href="#cxd-docs-nav">Skip to docs navigation</a>
            </div>
          </div>

          <Header />

          <div className="container fluid cxd-gutter cxd-layout">
            <aside className="cxd-sidebar">
              <dialog
                className="large:drawer drawer-start"
                id="cxdSidebar"
                aria-labelledby="cxdSidebarOffcanvasLabel"
              >
                <div className="drawer-header border-bottom">
                  <h5 className="drawer-title" id="cxdSidebarOffcanvasLabel">Browse docs</h5>
                  <button
                    type="button"
                    className="close-button"
                    data-cx-dismiss="drawer"
                    aria-label="Close"
                    data-cx-target="#cxdSidebar"
                  />
                </div>
                <div className="drawer-body">
                  <Sidebar currentRoute={location?.pathname ?? mdx.frontmatter.route} />
                </div>
              </dialog>
            </aside>

            <main className="cxd-main">
              <div className="cxd-intro">
                <div className="medium:d-flex medium:flex-row-reverse justify-content-between align-items-start">
                  <div className="mb-medium medium:mb-0">
                    <a
                      className="button default small"
                      href={`https://github.com/chassis-ui/react/blob/main/packages/docs/content/${mdx.frontmatter.route}.mdx`}
                      title="View and edit this file on GitHub"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on GitHub
                    </a>
                  </div>
                  <h1 className="cxd-title mb-small" id="content">
                    {mdx.frontmatter.name ? mdx.frontmatter.name : mdx.frontmatter.title}
                  </h1>
                </div>
                {mdx.frontmatter.description && (
                  <p className="cxd-subtitle">{mdx.frontmatter.description}</p>
                )}
              </div>

              {hasToc && (
                <div className="cxd-toc">
                  <button
                    className="button default mb-large text-decoration-none cxd-toc-toggle medium:d-none"
                    type="button"
                    data-cx-toggle="collapse"
                    data-cx-target="#tocContents"
                    aria-expanded="false"
                    aria-controls="tocContents"
                  >
                    On this page
                    <svg className="icon icon-small" aria-hidden="true">
                      <use href="#chevron-sort-solid" />
                    </svg>
                  </button>
                  <strong className="d-none medium:d-block h6 my-xsmall">On this page</strong>
                  <hr className="d-none medium:d-block my-xsmall" />
                  <div className="collapse cxd-toc-collapse" id="tocContents">
                    <nav id="TableOfContents">
                      <Toc items={mdx.tableOfContents} />
                    </nav>
                  </div>
                </div>
              )}

              <div className="cxd-content">
                <MDXProvider components={components}>
                  <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
                </MDXProvider>
              </div>
            </main>
          </div>

          <Footer />
        </div>
      </myContext.Provider>
    </>
  )
}

DocsLayout.propTypes = {
  children: PropTypes.node,
  data: PropTypes.any,
}

DocsLayout.displayName = 'DocsLayout'

export default DocsLayout

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    site {
      siteMetadata {
        title
      }
    }
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        name
        description
        route
      }
      tableOfContents(maxDepth: 3)
    }
  }
`
