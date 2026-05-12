import React, { FC } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Footer, Header } from './../components/'
import './../scss/docs.scss'
import { CxContainer } from '@chassis-ui/react/src/index'

const DefaultLayout: FC = ({ children, ...props }) => {
  return (
    <>
      <Helmet>
        <script src="https://media.ethicalads.io/media/client/ethicalads.min.js" />
      </Helmet>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node,
}

DefaultLayout.displayName = 'DefaultLayout'

export default DefaultLayout
