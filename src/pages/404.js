import React from "react"
import { graphql, Link } from "gatsby"
import Lottie from "react-lottie"

import Layout from "../components/layout"
import SEO from "../components/seo"
import animationData from "../lotties/404.json"


const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="404: Not Found" />
        <Link to="/">
          <Lottie options={defaultOptions} />
          <p>This page is not real, you imagined it.</p>
        </Link>
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
      }
    }
  }
`
