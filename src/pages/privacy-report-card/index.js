import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Table from "../../components/Table"
import useViewSize from "../../hooks/useViewSize"
import SEO from "../../components/seo"
import { TableColumns } from "./TableColumns"


const PrivacyReportCard = ({ data, location }) => {
  const { width: viewWidth } = useViewSize()
  const { title } = data.site.siteMetadata
  const sites = data.allMarkdownRemark.edges

  const sitesInfo = sites.map(siteNode => {
    const {frontmatter} = siteNode.node
    const {ratings} = frontmatter
    return {
      ...frontmatter,
      ...ratings,
      id: frontmatter.name
    }
  })

  const equalWidth = Math.floor(viewWidth / TableColumns.length) - 13
  const columnWidth = equalWidth > 100 ? equalWidth : 100
  for (let i = 0; i < TableColumns.length; i += 1) {
    TableColumns[i].width = columnWidth
    TableColumns[i].resizable = true
  }

  return (
    <Layout title={title} location={location} fullWidth>
      <SEO title={title} description="An easy overview and summary of privacy policies of sites across the web." />
      <h2>
        Privacy Report: Summary of privacy policies of (popular) services.
      </h2>
      <hr />
      <Table columns={TableColumns} data={sitesInfo} rowKey="id" />
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
    allMarkdownRemark(filter: {parent: {}, frontmatter: {category: {eq: "privacy-report-detail"}}}) {
    edges {
      node {
        frontmatter {
          name
          ratings {
            darkPatterns
            dataRetention
            locationTracking
            userControl
          }
          reference
          summary
        }
      }
    }
  }
  }
`

export default PrivacyReportCard
