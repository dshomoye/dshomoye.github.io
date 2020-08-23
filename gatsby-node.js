/* eslint-disable no-undef */
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const tagTemplate = path.resolve("./src/templates/tags.js")
  const privacyDetailTemplate = path.resolve(
    "./src/templates/privacy-report-detail.js"
  )
  const result = await graphql(
    `
      {
        tagsGroup: allMarkdownRemark(limit: 2000) {
          group(field: frontmatter___tags) {
            fieldValue
          }
        }

        privacyDetailsPages: allMarkdownRemark(
          filter: { frontmatter: { category: { eq: "privacy-report-detail" } } }
        ) {
          edges {
            node {
              parent {
                ... on File {
                  name
                }
              }
            }
          }
        }

        postsRemark: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              parent {
                ... on File {
                  name
                }
              }
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  const posts = result.data.postsRemark.edges

  posts.forEach((post, index) => {
    if (post.node.parent.name === "index") {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    }
  })

  const tags = result.data.tagsGroup.group
  tags.forEach(tag => {
    createPage({
      path: `/tags/${tag.fieldValue}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })

  const privacyDetailsPages = result.data.privacyDetailsPages.edges
  privacyDetailsPages.forEach(pageNode => {
    const { name } = pageNode.node.parent
    createPage({
      path: `/privacy-report-card/details/${name}`,
      component: privacyDetailTemplate,
      context: {
        slug: `/${name}/`,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
