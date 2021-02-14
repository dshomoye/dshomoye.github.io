import React from "react"
import { Link, graphql } from "gatsby"
import rehypeReact from "rehype-react"

import MediaBox from "../components/MediaBox"
import MediaSwipe from "../components/MediaSwipe"
import SmartLink from "../components/SmartLink"
import GalleryContainer from "../components/GalleryContainer"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import TagPills from "../components/TagPills"
import LikeButton from "../components/LikeButton"

class BlogPostTemplate extends React.Component {
  constructor(props) {
    super(props)
    this.state = { galleryIndex: 0, galleryModalIsOpen: false }
    this.setAndOpenGallery = this.setAndOpenGallery.bind(this)
    this.closeGalleryModal = this.closeGalleryModal.bind(this)
  }

  setAndOpenGallery (index) {
    if (index !== null) {
      this.setState({
        galleryIndex: index,
        galleryModalIsOpen: true,
      })
    }
  }

  closeGalleryModal () {
    this.setState({
      ...this.state,
      galleryModalIsOpen: false,
    })
  }

  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    const renderAst = new rehypeReact({
      createElement: React.createElement,
      components: {
        "media-box": MediaBox,
        a: SmartLink,
      },
    }).Compiler

    const lastUpdated = post.frontmatter.lastUpdated
      ? `Last updated: ${post.frontmatter.lastUpdated}`
      : null

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <GalleryContainer
          closeModal={this.closeGalleryModal}
          setGalleryIndex={this.setAndOpenGallery}
        >
          <article
            data-sal="fade"
            data-sal-easing="ease"
            data-sal-duration="700"
          >
            <header>
              <h1
                style={{
                  marginTop: '2rem',
                  marginBottom: '2rem',
                }}
              >
                {post.frontmatter.title}
              </h1>
              <h2
                style={{
                  fontSize: "1rem",
                  marginBottom: '2*/9rem'
                }}
              >
                {post.frontmatter.description}
              </h2>
              <p
                style={{
                  fontSize: `0.8rem`,
                  whiteSpace: "pre-wrap",
                }}
              >
                {`${post.frontmatter.date}    |    ${post.timeToRead} min. read`}
              </p>
              <TagPills tagNames={post.frontmatter.tags} />
            </header>
            <section>{renderAst(post.htmlAst)}</section>
            <p style={{ fontSize: `0.6rem` }}>{lastUpdated}</p>
            <hr
              style={{
                marginBottom: `1.5rem`,
              }}
            />
            <div style={{width: "100%", textAlign: "center"}}>
              <LikeButton pathname={this.props.path} hostname={this.props.location.hostname}/>
            </div>
            <footer>
              <Bio />
            </footer>
          </article>
          <MediaSwipe
            sources={post.frontmatter.gallerySources}
            name={post.frontmatter.title}
            index={this.state.galleryIndex}
            isOpen={this.state.galleryModalIsOpen}
            closeModal={this.closeGalleryModal}
          />
        </GalleryContainer>
        <nav>
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      htmlAst
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        gallerySources {
          caption
          src
          type
        }
        lastUpdated(formatString: "MMMM DD, YYYY")
        tags
      }
      timeToRead
    }
  }
`
