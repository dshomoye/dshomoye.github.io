const sourceS3 = {
  resolve: 'gatsby-source-s3-image',
  options: {
    bucketName: 'dshomoye',
    domain: "nyc3.digitaloceanspaces.com", // [optional] Not necessary to define for AWS S3; defaults to `s3.amazonaws.com`
    protocol: 'https', // [optional] Default to `https`.
  },
}

module.exports = {
  siteMetadata: {
    title: `Damola's blog`,
    author: `Adedamola Shomoye`,
    description: `Posts, long forms, short forms, etc on everything about everything, that matters (to me).`,
    siteUrl: `https://dshomoye.github.io`,
    social: {
      twitter: `dhamoh_6`,
    },
  },
  plugins: [
    sourceS3,
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
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Dshomoye's blog`,
        short_name: `dshomoye`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}
