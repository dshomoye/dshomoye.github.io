import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import TagPills from "../components/TagPills"
import { bucketRoot } from "../utils/constants"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Home" />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          let banner = null
          if (node.frontmatter.bannerImage) {
            banner = (
              <Link to={node.fields.slug} className="article-item banner-container">
              <div
                className="lazyload home-article-banner"
                style={{ height: "100%" }}
                data-bg={`${bucketRoot}/${node.frontmatter.bannerImage}?w=900`}
                />
              </Link>
            )
          }
          if (node.parent.sourceInstanceName === "blog") {
            return (
              <article
                className="card-article flex"
                data-sal="slide-up"
                data-sal-easing="ease"
                data-sal-duration="700"
                key={node.fields.slug}
              >
                <div className="article-item article-content">
                  <Link className="home-article-link" to={node.fields.slug}>
                    <header>
                      <h3>{title}</h3>
                      <small style={{ backgroundColor: "None" }}>
                        {node.frontmatter.date}
                      </small>
                    </header>
                    <section>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: node.frontmatter.description || node.excerpt,
                        }}
                      />
                    </section>
                  </Link>
                  <TagPills tagNames={node.frontmatter.tags} />
                </div>
                {banner}
              </article>
            )
          }
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
            tags
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
`
