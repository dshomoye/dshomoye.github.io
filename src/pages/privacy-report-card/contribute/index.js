import React, { useState } from "react"
import { graphql } from "gatsby"
import { BiAward } from "react-icons/bi"

import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import { PrivacyReportTableColumns } from "../../../utils/constants"
import { encodeFormData } from "../../../utils"

const Contribute = ({ location }) => {
  // 0: notSubmit, 1: submitting, 2: submitted, 3: failed
  const [submit, setSubmit] = useState(0)
  const [filledText, setFilledText] = useState({})

  const handleChange = e => {
    e.persist()
    console.log(e)
    let val = e.target.value
    if(e.target.type === 'checkbox') {
      val = e.target.checked
    }
    setFilledText(oldFilledText => {
      return {
        ...oldFilledText,
        [e.target.name]: val
      }
    })
  }

  const handleSubmit = e => {
    setSubmit(1)
    e.preventDefault()
    console.log(e)
    const form = e.target
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeFormData({
        ...filledText,
        "form-name": form.getAttribute('name')
      })
    })
      .then(() => {
        setSubmit(2)
      })
      .catch(() => {
        setSubmit(3)
      })
  }

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
        onSubmit={handleSubmit}
        name="privacy-summary-submission"
        data-sal="slide-down"
        data-sal-easing="ease"
        data-sal-duration="700"
        action="/privacy-report-card"
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
            onChange={handleChange}
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
            style={{ fontSize: "small" }}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-item">
          <p style={{ marginBottom: "5px" }}>Ratings:</p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {PrivacyReportTableColumns.filter(k => k.isRating).map(
              reportColumn => {
                return (
                  <div key={reportColumn.key}>
                    <label htmlFor={reportColumn.key} className="input-label">
                      <BiAward /> {reportColumn.title}:
                    </label>
                    <input
                      className="styled-checkbox"
                      type="checkbox"
                      name={reportColumn.key}
                      onChange={handleChange}
                    />
                  </div>
                )
              }
            )}
          </div>
        </div>
        <div className="form-item">
          <label htmlFor="reference" className="input-label">
            Privacy Policy Link*:
          </label>
          <input
            className="styled-input"
            type="url"
            name="reference"
            placeholder="ex. https://policies.google.com/privacy"
            required
            onChange={handleChange}
          />
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
            onChange={handleChange}
          />
        </div>
        <div className="form-item">
          <input type="submit" value="Submit" className="submit-btn" />
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
