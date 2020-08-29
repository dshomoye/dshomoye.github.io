import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import { BiAward } from "react-icons/bi"
import { notify } from "react-notify-toast"
import { FiCheckCircle } from "react-icons/fi"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import { PrivacyReportTableColumns } from "../../utils/constants"
import SmartLink from "../../components/SmartLink"

const Contribute = ({ location, data }) => {
  // 0: notSubmit, 1: submitting, 2: submitted, 3: failed
  const [submit, setSubmit] = useState(0)
  const [filledText, setFilledText] = useState({})

  const handleChange = e => {
    e.persist()
    let val = e.target.value
    if (e.target.type === "checkbox") {
      val = e.target.checked
    }
    setFilledText(oldFilledText => {
      return {
        ...oldFilledText,
        [e.target.name]: val,
      }
    })
  }

  const handleError = () => {
    setSubmit(3)
    notify.show("Submission Failed ☹️. Try Again", "error")
  }

  const handleSubmit = e => {
    setSubmit(1)
    e.preventDefault()
    fetch("/.netlify/functions/privacy-report", {
      method: "POST",
      body: JSON.stringify(filledText),
    })
      .then(res => {
        if (res.ok) {
          setSubmit(2)
          notify.show("Submission Created!", "success")
        } else {
          handleError()
        }
      })
      .catch(handleError)
  }

  let submitBtnState = {
    value: "Submit",
    className: "submit-btn",
    disabled: false,
  }

  if (submit === 1) {
    submitBtnState = {
      value: "Submitting",
      className: "disabled-submit-btn",
      disabled: true,
    }
  }

  let body = (
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
        <p className="honeypot">
          <label>
            Don’t fill this out if you are human:{" "}
            <input name="bot-field" onChange={handleChange} />
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
      <hr/>
      <div className="form-item">
        <p>Attribution:</p>
        <label htmlFor="contributor" className="input-label">
          Name for attribution (Optional):
        </label>
        <input
          className="styled-input"
          type="text"
          name="contributor"
          placeholder="John Smith"
          onChange={handleChange}
        />
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
        <input type="submit" {...submitBtnState} />
      </div>
    </form>
  )

  if (submit === 2) {
    body = (
      <div
        className="card-article home-card"
      >
        <div style={{ margin: "20px", marginTop: "0px" }}>
          <h2>
            Submitted <FiCheckCircle />
          </h2>
          <hr />
          <p>
            All submissions will be reviewed for approval before being added to
            summaries.
          </p>
          <p>
            View{" "}
            <SmartLink href="https://github.com/dshomoye/dshomoye.github.io/pulls">
              pull requests
            </SmartLink>{" "}
            to check the status of the submission.
          </p>
          <Link to="/privacy-report-card">Return to summary.</Link>
        </div>
      </div>
    )
  }

  return (
    <Layout title={data.site.siteMetadata.title} location={location}>
      <SEO
        title="Privacy Summary Contribution"
        description="Contributions to the privacy report card are welcome."
      />
      {body}
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
