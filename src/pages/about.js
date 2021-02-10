import React from "react"
import { graphql, Link } from "gatsby"
import Image from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const author = data.site.siteMetadata.author
    const imageSharp = data.avatar.childImageSharp.fixed

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="About Me" />
        <div className="about-container">
          <div
            className="about-image"
            data-sal="slide-down"
            data-sal-easing="ease"
            data-sal-duration="700"
          >
            <Image
              fixed={imageSharp}
              alt={author}
              style={{
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
          </div>
          <article
            className="card-article about-card"
            data-sal="slide-up"
            data-sal-easing="ease"
            data-sal-duration="700"
          >
            <h1>About Me</h1>
            <section>
              <p>
                I’m a Full-Stack Software Engineer at Splunk; Previously, I was a software engineer at Capital One (they are totally a tech company!).
                <br />
                I primarily write in JavaScript and Python, 
                but I have worked in Go and Java too, and always trying out new languages, like <Link to="/trying-rust-lang">Rust</Link>.
                <br />
                <br />
                Believe this, I love everything tech. In a “the future is gonna
                be so awesome” kind of way. All cautiously of course. We have to
                stay on sky net’s good side.
                <br />
                I am always looking for something new to learn or work on. 
                And I occasionally travel, which I hope to return to when regular civilization is restored.
                <br />
                Video games are a fun pass time too.
                <br />
                I grew up in Nigeria. It’s not Wakanda, but it was great in a very special way, I loved it.
              </p>
            </section>
          </article>
        </div>
      </Layout>
    )
  }
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author
      }
    }
    avatar: file(absolutePath: { regex: "/damola.png/" }) {
      childImageSharp {
        fixed(width: 150, height: 150) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
