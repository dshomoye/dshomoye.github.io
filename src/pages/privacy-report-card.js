import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

const PrivacyReportCard = ({ data, location }) => {
  const {title} = data.site.siteMetadata
  return (
    <Layout title={title} location={location} fullWidth>
      <h2>Privacy Report: Summary of privacy policies of (popular) services online .</h2>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default PrivacyReportCard