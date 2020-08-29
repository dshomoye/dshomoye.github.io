import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import { BiAward } from "react-icons/bi"
import { notify } from "react-notify-toast"
import {navigate} from "@reach/router"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import { PrivacyReportTableColumns } from "../../utils/constants"

const Contribute = ({ location }) => {
  // 0: notSubmit, 1: submitting, 2: submitted, 3: failed
  const [submit, setSubmit] = useState(0)
  const [filledText, setFilledText] = useState({})

  useEffect(() => {
    if(submit === 2) {
      setTimeout(() => {
        navigate("/privacy-report-card")
      }, 1500)
    }
  }, [submit])

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
      .then((res) => {
        if(res.ok) {
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
    disabled: false
  }

  if(submit === 1) {
    submitBtnState = {
      value: "Submitting",
      className: "disabled-submit-btn",
      disabled: true
    }
  } else if (submit === 2) {
    submitBtnState = {
      value: "Submitted",
      disabled: true,
      className: "disabled-submit-btn"
    }
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
          <input
            type="submit"
            {...submitBtnState}
          />
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
