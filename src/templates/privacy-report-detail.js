import React from "react"
import { graphql } from "gatsby"

import SEO from "../components/seo"
import Layout from "../components/layout"

const DetailTemplate = ({ data, location }) => {
  const { title } = data.site.siteMetadata

  return (
    <Layout location={location} title={title}>
      <SEO title={title} description={`privacy report for site name`} />
      <article data-sal="fade" data-sal-easing="ease" data-sal-duration="700">
        <p>Hello</p>
      </article>
    </Layout>
  )
}

export const pageQuery = graphql`
  query DetailBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      htmlAst
    }
  }
`

export default DetailTemplate
