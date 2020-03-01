import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
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
          let banner = null
          const articleContentProps = {
            className: "article-content",
          }
          if (node.frontmatter.bannerImage) {
            articleContentProps.className = "article-item article-content"
            banner = (
              <div
                className="lazyload home-article-banner article-item"
                data-bg={`${bucketRoot}/${node.frontmatter.bannerImage}`}
              />
            )
          }
          return (
            <Link
              style={{ boxShadow: `none` }}
              to={node.fields.slug}
              key={node.fields.slug}
            >
              <article
                className="card-article home-card"
                data-sal="slide-up"
                data-sal-easing="ease"
                data-sal-duration="700"
              >
                <div {...articleContentProps}>
                  <header>
                    <h3>{title}</h3>
                    <small>{node.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: node.frontmatter.description || node.excerpt,
                      }}
                    />
                  </section>
                </div>
                {banner}
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
