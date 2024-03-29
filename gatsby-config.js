/* eslint-disable no-undef */
require("dotenv").config()

module.exports = {
  siteMetadata: {
    title: `Damola's blog`,
    author: `Adedamola Shomoye`,
    description: `Posts, long forms, short forms, etc on everything about everything, that matters (to me).`,
    siteUrl: `https://www.dshomoye.dev`,
    social: {
      twitter: `dhamoh_6`,
    },
    keywords: ['blog', 'tech', 'gatsby', 'travel', 'jamstack']
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-component",
            options: {
              components: ["media-box"],
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              isIconAfterHeader: true,
            },
          },
          {
            resolve: `gatsby-remark-embed-snippet`,
            options: {
              directory: `${__dirname}`,
            },
          },
          {
            resolve: `gatsby-remark-highlight-code`,
            options: {
              theme: "one-dark",
            },
          },
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Dshomoye's blog`,
        short_name: `dshomoye`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#000000`,
        display: `minimal-ui`,
        icon: `content/assets/d-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-scroll-reveal`,
      options: {
        threshold: 0.05,
        rootMargin: "100px 0px",
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        appendScript: require.resolve(`${__dirname}/src/notification-sw.js`),
      },
    },
    `gatsby-plugin-dark-mode`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              const blogPosts = allMarkdownRemark.edges.filter(
                (edge) => edge.node.parent.sourceInstanceName === "blog"
              )
              return blogPosts.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt(pruneLength: 500)
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                      parent {
                        ... on File {
                          sourceInstanceName
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "RSS Feed for Damola's Blog",
            // optional configuration to specify external rss feed, such as feedburner
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-goatcounter",
      options: {
        code: "dshomoye",
        pixel: true,
        allowLocal: false,
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
    },
  ],
}
