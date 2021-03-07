import React from "react"
import { graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ArticleCard from "../components/ArticleCard"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const images = data.allFile.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Home" />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          let fluid
          let imageSrc
          const imageNode = images.find(
            n => n.node.relativePath === node.frontmatter.bannerImage
          )
          if (imageNode) {
            if(imageNode.node.childImageSharp?.gatsbyImageData) {
              fluid = imageNode.node.childImageSharp.gatsbyImageData
            } else {
              imageSrc = imageNode.node.publicURL
            }
          }
          if (node.parent.sourceInstanceName === "blog") {
            return (
              <ArticleCard
                title={title}
                slug={node.fields.slug}
                date={node.frontmatter.date}
                excerpt={node.excerpt}
                tags={node.frontmatter.tags}
                fluid={fluid}
                key={node.fields.slug}
                src={imageSrc}
              />
            )
          }
        })}
      </Layout>
    );
  }
}

export default BlogIndex

export const pageQuery = graphql`{
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
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
  allFile(filter: {extension: {ne: "md"}}) {
    edges {
      node {
        relativePath
        publicURL
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
    }
  }
}
`
