import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Table from "../components/Table"

const privcayData = [
  {
    id: 1,
    name: "Google",
    crossSiteTracking: 5,
    locationTracking: 5,
    dataRetention: 4,
    userControl: 4,
    darkPatterns: 5,
    summaryLink: "/privacy-report-card/google",
    referenceLink: "https://policies.google.com/privacy",
  },
]

const dataColumns = [
  {
    key: "name",
    title: "Service Summary",
    width: 100,
    frozen: true,
    resizable: true,
    linkKey: "summaryLink",
    type: "link"
  },
  {
    key: "crossSiteTracking",
    title: "Cross Site Tracking",
    width: 100,
    resizable: true
  },
  {
    key: "locationTracking",
    title: "Location Tracking",
    width: 100,
    resizable: true
  },
  {
    key: "dataRetention",
    title: "Data Retentation",
    width: 100,
    resizable: true
  },
  {
    key: "userControl",
    title: "User Control",
    width: 100,
    resizable: true
  },
  {
    key: "darkPatterns",
    title: "Dark Pattern Usage",
    width: 100,
    resizable: true
  },
  {
    key: "reference",
    title: "Policy Reference",
    width: 100,
    resizable: true,
    linkKey: "referenceLink",
    type: "link",
    linkText: "View ↗"
  }
]

const PrivacyReportCard = ({ data, location }) => {
  const { title } = data.site.siteMetadata
  return (
    <Layout title={title} location={location} fullWidth>
      <h2>
        Privacy Report: Summary of privacy policies of (popular) services.
      </h2>
      <hr />
      <Table columns={dataColumns} data={privcayData} rowKey="id" />
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
