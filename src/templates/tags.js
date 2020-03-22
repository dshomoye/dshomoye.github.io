import React from "react"
import { Link, graphql } from "gatsby"

import "../styles/tags.css"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Tags = ({ pageContext, data, location }) => {
  console.log('tag data ', data, ' location ', location)
  const { tag } = pageContext
  const pageTitle = `${tag} posts`
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} "${tag}" post${
    totalCount === 1 ? "" : "s"
  }`

  return (
    <Layout location={location} title={data.site.siteMetadata.title}>
      <SEO title={pageTitle} description={pageTitle} />
      <div>
      <h3>{tagHeader}</h3>
      <ul class="tag-list">
        {edges.map(({ node }) => {
          const { slug } = node.fields
          const { title } = node.frontmatter
          return (
            <li key={slug}>
              <Link to={slug}>{title}</Link>
            </li>
          )
        })}
      </ul>
    </div>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
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