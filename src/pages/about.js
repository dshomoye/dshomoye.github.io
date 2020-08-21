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
                I’m a full stack developer at Splunk; Before that, I was a software engineer at Capital One (they are totally a tech company!).
              </p>
              <p>
                Believe this, I love everything tech. In a “the future is gonna
                be so awesome” kind of way. All cautiously of course. We have to
                stay on sky net’s good side.
              </p>

              <p>
                {`I have a PlayStation 4 pro and it is how I usually unwind at the end of day. 
                I really don't have a lot of options anyway 🥺. #2020`}
              </p>
              <p>
                {`I like to hike. This is a new...err... "hobby" for me, while I was living in Virginia. 
                It’s nice to be... *one with nature*. I'm now based out of the bay area. `}
              </p>
              <p>
                {`I like to travel. I don’t have a long list of mind-blowing places
                I’ve been to, yet, but trust me. I like to travel.`}
              </p>

              <p>
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
