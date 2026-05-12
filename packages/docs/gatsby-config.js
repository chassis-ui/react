/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require(`./package.json`)

module.exports = {
  siteMetadata: {
    title: `Chassis React`,
    titleTemplate: `%s · Chassis React`,
    description: `Chassis React is a UI Component library for React.js, built as part of the Chassis UI design system.`,
    author: `@chassis_ui`,
    url: `https://chassis-ui.io/react/`,
    siteUrl: `https://chassis-ui.io/react/`,
    image: ``,
    twitterUsername: `@chassis_ui`,
  },
  pathPrefix: `react/`,
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/content/${pkg.config.version_short}/`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          docs: require.resolve(`./src/templates/Docs.tsx`),
        },
        gatsbyRemarkPlugins: [
          {
            resolve: require.resolve(`./src/plugins/gatsby-remark-import-markdown`),
            options: {
              directory: `${__dirname}/content/${pkg.config.version_short}/api/`,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: `anchor-link`,
              icon: `<span>#</span>`,
              isIconAfterHeader: true,
            },
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "nofollow"
            }
          }
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        sassOptions: {
          loadPaths: [
            `${__dirname}/node_modules`,
            `${__dirname}/../../node_modules`,
          ],
          silenceDeprecations: ['import'],
        },
      },
    },
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [
          '/api/*', // you can also pass valid RegExp to exclude internal tags for example
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          `UA-118965717-1`, // Google Analytics / GA
        ],
      },
    },
  ],
}
