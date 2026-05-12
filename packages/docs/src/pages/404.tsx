import * as React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import DefaultLayout from './../templates/Layout'
import Seo from './../components/Seo'
import { CxButton } from '@chassis-ui/react/src/index'

const NotFoundPage = () => {
  const { site } = useStaticQuery(query)
  const { siteUrl } = site.siteMetadata
  return (
    <DefaultLayout>
      <Seo title="404: Not found" />
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      <CxButton href={siteUrl}>Go to documentation</CxButton>
    </DefaultLayout>
  )
}

export default NotFoundPage

const query = graphql`
  query URL {
    site {
      siteMetadata {
        siteUrl: url
      }
    }
  }
`
