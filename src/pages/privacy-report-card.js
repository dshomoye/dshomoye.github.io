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
    openness: 4,
    usercontrol: 4,
    darkPatterns: 5,
  },
]

const dataColumns = [
  {
    key: "name",
    title: "Site Name",
    width: 100
  },
  {
    key: "crossSiteTracking",
    title: "Cross Site Tracking",
    width: 100
  },
  {
    key: "locationTracking",
    title: "Location Tracking",
    width: 100
  },
  {
    key: "dataRetention",
    title: "Data Retentation",
    width: 100
  },
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
