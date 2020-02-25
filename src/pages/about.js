import React from "react"
import { graphql } from "gatsby"
import Image from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/about.css"

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
            <h2>About Me</h2>
            <section>
              <p>
                I’m a full stack developer at Splunk — joining in Feb, im still
                a new “Splunker”; Before that, I was helping Capital One change
                banking for good.
              </p>
              <p>
                Believe this, I love everything tech. In a “the future is gonna
                be so awesome” kind of way. All cautiously of course. We have to
                stay on sky net’s good side.
              </p>

              <p>
                I play overwatch, almost exclusively Ashe, and definitely
                exclusively on a PS4 pro. Is it me or is her hit-scan sorta
                kinda wonky?
              </p>
              <p>
                I like to hike. I picked this up less than two years ago, after
                moving to Virginia. It’s nice to be... *one with nature*
              </p>
              <p>
                I like to travel. I don’t have a long list of awesome places
                I’ve been to, yet, but trust me. I like to travel.
              </p>

              <p>
                I grew up in Nigeria. It’s not WAKANDA, but it was great in its
                own way, and I loved growing up there.
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
    avatar: file(absolutePath: { regex: "/profile.jpg/" }) {
      childImageSharp {
        fixed(width: 150, height: 150) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
