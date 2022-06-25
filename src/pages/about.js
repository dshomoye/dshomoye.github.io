import React from "react"
import { graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

class AboutPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const author = data.site.siteMetadata.author

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
            <StaticImage
              src="../../content/assets/damola.png"
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
                I’m a Software Engineer at Gem; 
                99.9% sure I am not a bot, but I get paid to talk to computers so who knows.
                <br />I primarily write in JavaScript and Python, but I have
                worked in Go too, and always trying out new languages,
                like <Link to="/trying-rust-lang">Rust</Link>.
                <br />
                <br />
                Believe this, I love everything tech. In a “the future is gonna
                be so awesome” kind of way. All cautiously of course. Have to
                stay on sky net’s good side.
                <br />
                I am always looking for something new to learn or work on. And I
                occasionally travel.
                <br />
                Video games are a fun pass time too.
                <br />I grew up in Nigeria. It’s no Wakanda, but it was great
                in a very special way.
              </p>
            </section>
          </article>
        </div>
      </Layout>
    )
  }
}

export default AboutPage

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
        author
      }
    }
  }
`
