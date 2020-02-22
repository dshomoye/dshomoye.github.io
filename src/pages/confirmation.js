import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

class Confirmation extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Thanks: Subscription Confirmation." />
        <h1>Thanks!</h1>
        <p>
          You are now subscribed to new updates.
          <Link to="/"> Return home. </Link>
        </p>
      </Layout>
    )
  }
}

export default Confirmation

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
