import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Table from "../../components/Table"
import useViewSize from "../../hooks/useViewSize"

export const PrivcayData = [
  {
    id: 1,
    name: "Google",
    crossSiteTracking: 5,
    locationTracking: 5,
    dataRetention: 4,
    userControl: 4,
    darkPatterns: 5,
    summaryLink: "/privacy-report-card/details/google",
    referenceLink: "https://policies.google.com/privacy",
    detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Elementum eu facilisis sed odio morbi quis. Nisi est sit amet facilisis magna. Porta lorem mollis aliquam ut porttitor leo. Ornare suspendisse sed nisi lacus sed. Eu tincidunt tortor aliquam nulla facilisi cras fermentum odio eu. Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Aliquam faucibus purus in massa tempor nec feugiat nisl. Justo nec ultrices dui sapien eget. Mattis molestie a iaculis at erat pellentesque adipiscing commodo elit. Quis hendrerit dolor magna eget est lorem ipsum dolor. Sed viverra tellus in hac habitasse platea dictumst. Cras sed felis eget velit aliquet. Quisque egestas diam in arcu cursus euismod quis viverra. Purus sit amet luctus venenatis lectus magna. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Malesuada nunc vel risus commodo viverra maecenas accumsan lacus. Ac orci phasellus egestas tellus. Vitae tortor condimentum lacinia quis vel eros donec."
  },
]

const dataColumns = [
  {
    key: "name",
    title: "Service Summary",
    frozen: true,
    linkKey: "summaryLink",
    type: "link",
  },
  {
    key: "crossSiteTracking",
    title: "Cross Site Tracking",
  },
  {
    key: "locationTracking",
    title: "Location Tracking",
  },
  {
    key: "dataRetention",
    title: "Data Retentation",
  },
  {
    key: "userControl",
    title: "User Control",
  },
  {
    key: "darkPatterns",
    title: "Dark Pattern Usage",
  },
  {
    key: "reference",
    title: "Policy Reference",
    linkKey: "referenceLink",
    type: "link",
    linkText: "View ↗",
  },
]

const PrivacyReportCard = ({ data, location }) => {
  const { width: viewWidth } = useViewSize()
  const { title } = data.site.siteMetadata

  const equalWidth = Math.floor(viewWidth / dataColumns.length) - 13
  const columnWidth = equalWidth > 100 ? equalWidth : 100
  for (let i = 0; i < dataColumns.length; i += 1) {
    dataColumns[i].width = columnWidth
    dataColumns[i].resizable = true
  }

  return (
    <Layout title={title} location={location} fullWidth>
      <h2>
        Privacy Report: Summary of privacy policies of (popular) services.
      </h2>
      <hr />
      <Table columns={dataColumns} data={PrivcayData} rowKey="id" />
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
