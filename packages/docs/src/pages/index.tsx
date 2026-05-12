import * as React from 'react'
import { Link } from 'gatsby'

import DefaultLayout from './../templates/Layout'
import Seo from './../components/Seo'
import { CxButton, CxContainer, CxImage, CxRow } from '@chassis-ui/react/src/index'
import banner from './../assets/images/react_960px.png'
import pkg from './../../package.json'

const Home = () => {
  // const { site } = useStaticQuery(query)
  // const { siteUrl } = site.siteMetadata
  return (
    <DefaultLayout>
      <Seo title="Bootstrap React" />
      <div className="brd-masthead mb-3" id="content">
        <CxContainer className="px-4 medium:px-3">
          <CxRow className="large:align-items-center">
            <div className="col-8 mx-auto medium:col-4 medium:order-2 large:col-6">
              <CxImage fluid src={banner} />
            </div>
            <div className="medium:col-8 medium:order-1 large:col-6 text-center medium:text-start">
              <h1 className="mb-3">
                Bootstrap React UI components library backed by the professional team.
              </h1>
              <p className="lead mb-4">
                Quickly design and customize responsive mobile-first sites with Bootstrap React, the
                world’s most popular front-end open source toolkit, rebuilt for React.js.
              </p>
              <div className="d-flex flex-column medium:flex-row">
                <CxButton
                  component={Link}
                  className="mb-3 medium:me-3"
                  context="brd-primary"
                  to="/getting-started/introduction/"
                  size="large"
                >
                  Get started
                </CxButton>
                <CxButton
                  className="mb-3"
                  context="dark"
                  href="https://github.com/coreui/bootstrap-react"
                  size="large"
                  // variant="outline"
                  target="_blank"
                  rel="noopener"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    className="me-2"
                    viewBox="0 0 512 499.36"
                    role="img"
                    style={{ verticalAlign: 'text-top' }}
                  >
                    <title>GitHub</title>
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M256 0C114.64 0 0 114.61 0 256c0 113.09 73.34 209 175.08 242.9 12.8 2.35 17.47-5.56 17.47-12.34 0-6.08-.22-22.18-.35-43.54-71.2 15.49-86.2-34.34-86.2-34.34-11.64-29.57-28.42-37.45-28.42-37.45-23.27-15.84 1.73-15.55 1.73-15.55 25.69 1.81 39.21 26.38 39.21 26.38 22.84 39.12 59.92 27.82 74.5 21.27 2.33-16.54 8.94-27.82 16.25-34.22-56.84-6.43-116.6-28.43-116.6-126.49 0-27.95 10-50.8 26.35-68.69-2.63-6.48-11.42-32.5 2.51-67.75 0 0 21.49-6.88 70.4 26.24a242.65 242.65 0 0 1 128.18 0c48.87-33.13 70.33-26.24 70.33-26.24 14 35.25 5.18 61.27 2.55 67.75 16.41 17.9 26.31 40.75 26.31 68.69 0 98.35-59.85 120-116.88 126.32 9.19 7.9 17.38 23.53 17.38 47.41 0 34.22-.31 61.83-.31 70.23 0 6.85 4.61 14.81 17.6 12.31C438.72 464.97 512 369.08 512 256.02 512 114.62 397.37 0 256 0z"
                    />
                  </svg>
                  Github
                </CxButton>
              </div>
              <p className="text-muted mb-0">
                Currently <strong>v{pkg.version}</strong>
              </p>
            </div>
          </CxRow>
        </CxContainer>
        <CxContainer className="masthead-followup px-4 medium:px-3">
          <section className="row mb-5 medium:pb-4 align-items-center">
            <div className="medium:col-5">
              <h2 className="display-5 fw-normal">Installation</h2>
              <p className="lead fw-normal">Install Bootstrap React via npm or yarn.</p>
              <CxButton
                component={Link}
                className="mb-3"
                context="primary"
                to="/getting-started/introduction/"
                size="large"
                variant="outline"
              >
                Read installation docs
              </CxButton>
            </div>
            <div className="medium:col-7 medium:ps-5">
              <div className="highlight">
                <pre tabIndex={0} className="chroma">
                  <code className="language-sh" data-lang="sh">
                    npm install @chassis-ui/react @chassis-ui/css
                  </code>
                </pre>
              </div>
              <div className="highlight">
                <pre tabIndex={0} className="chroma">
                  <code className="language-sh" data-lang="sh">
                    yarn add @chassis-ui/react @chassis-ui/css
                  </code>
                </pre>
              </div>
            </div>
          </section>
        </CxContainer>
      </div>
    </DefaultLayout>
  )
}

export default Home
