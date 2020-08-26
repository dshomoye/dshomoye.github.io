import React from "react"
import { graphql } from "gatsby"
import {BiAward} from "react-icons/bi"

import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import { PrivacyReportTableColumns } from "../../../utils/constants"

const Contribute = ({ location }) => {
  return (
    <Layout title="Privacy Summary Contribution" location={location}>
      <SEO
        title="Privacy Summary Contribution"
        description="Contributions to the privacy report card are welcome and open to all."
      />
      <form
        className="form-container"
        autoComplete="on"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit
        data-sal="slide-down"
        data-sal-easing="ease"
        data-sal-duration="700"
      >
        <div className="form-heading">
          <p className="hidden">
            <label>
              Don’t fill this out if you are human: <input name="bot-field" />
            </label>
          </p>
          <h2 style={{ marginTop: "0" }}>Add New Privacy Summary.</h2>
        </div>
        <div className="form-item">
          <label htmlFor="siteName" className="input-label">
            Site Name*:
          </label>
          <input
            className="styled-input"
            type="text"
            name="siteName"
            placeholder="ex. Gooogle, Twitter etc"
            required
          />
        </div>
        <div className="form-item">
          <label htmlFor="summary" className="input-label">
            Summary*:
          </label>
          <textarea
            className="styled-input"
            name="summary"
            placeholder="Enter summary"
            style={{fontSize: "small"}}
          />
        </div>
        <div className="form-item">
          <p style={{marginBottom: '5px'}}>Ratings:</p>
          <div style={{display: "flex", flexWrap: "wrap"}}>
            {PrivacyReportTableColumns.filter(k => k.isRating).map(
              reportColumn => {
                return (
                  <div key={reportColumn.key}>
                    <label htmlFor={reportColumn.key} className="input-label">
                      <BiAward/> {reportColumn.title}:
                    </label>
                    <input
                      className="styled-checkbox"
                      type="checkbox"
                      name={reportColumn.key}
                    />
                  </div>
                )
              }
            )}
          </div>
        </div>
        <div className="form-item">
          <label htmlFor="email" className="input-label">
            Email (Optional):
          </label>
          <input
            className="styled-input"
            type="email"
            name="email"
            placeholder="Enter email"
          />
        </div>
        <div className="form-item">
          <input type="submit" value="Submit" className="submit-btn"/>
        </div>
      </form>
    </Layout>
  )
}

export default Contribute

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
