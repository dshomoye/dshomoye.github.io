import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import { bucketRoot } from "../utils/constants"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
            <article key={node.fields.slug} className="home-article">
              <header>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  {title}
                </h3>
                <small>{node.frontmatter.date}</small>
              </header>
              <section>
                {
                  node.frontmatter.bannerImage ? 
                  <div
                  className="lazyload"
                  data-bg={`${bucketRoot}/${node.frontmatter.bannerImage}`}
                  style={{
                    minHeight: rhythm(8),
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 9,
                    marginBottom: rhythm(0.5),
                    marginTop: rhythm(0.5)
                  }}/> : null
                }
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </section>
            </article>
            </Link>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            bannerImage
          }
        }
      }
    }
  }
`
