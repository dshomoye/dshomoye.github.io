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
                I’m a software engineer at Splunk; before that, I was
                at Capital One (they are totally a tech
                company!).
                <br />I've worked with JavaScript and Python, I mainly write Go now and always trying out new languages,
                like <Link to="/trying-rust-lang">Rust</Link>.
                <br />
                <br />
                Believe this, I love everything tech. In a "future is gonna
                be so awesome” kind of way. All cautiously of course. We have to
                stay on sky net’s good side.
                <br />
                I am always looking for something new to learn or work on. And I
                occasionally travel, which I am trying to get back to now, since 2020 happened.
                <br />
                Video games are a fun pass time too. 
                <br />I particularly recommend (non-exhaustive): Legend of Zelda: Breath of the Wild; Ghost of Tsushima and Control, in that order.
                <br />I grew up in Nigeria. It’s not Wakanda, but it was great
                in a very special way, I loved it.
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
