import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

import SEO from "../components/seo"
import "../styles/Subscribe.css"

const Subscribe = ({ ...props }) => {
  const siteTitle = props.data.site.siteMetadata.title
  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title="Newsletter Subscription Page"
        description="Sign up for my newsletter to be notified of updates."
      />
      <form
        className="form-container"
        autoComplete="on"
        name="subscription"
        method="POST"
        action="/confirmation"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        <div className="form-heading">
          <p class="hidden">
            <label>
              Don’t fill this out if you're human: <input name="bot-field" />
            </label>
          </p>
          <input type="hidden" name="form-name" value="subscription" />
          <h2>
            Get notified of new updates!{` `}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="var(--textNormal)"
              viewBox="0 0 25 25"
            >
              <path d="M.026 24l11.974-11.607 11.974 11.607h-23.948zm11.964-23.961l-11.99 8.725v12.476l7.352-7.127-5.653-4.113 10.291-7.488 10.309 7.488-5.655 4.108 7.356 7.132v-12.476l-12.01-8.725z" />
            </svg>{" "}
          </h2>
        </div>
        <div className="form-item">
          <label htmlFor="email" className="input-label">
            Email:{" "}
          </label>
          <input
            className="styled-input"
            type="email"
            name="email"
            placeholder="your email"
            required
          ></input>
        </div>
        <div className="form-item">
          <label htmlFor="name" className="input-label">
            Name:{" "}
          </label>
          <input
            className="styled-input"
            type="text"
            name="name"
            placeholder="(optional) name"
          ></input>
        </div>
        <div className="form-item form-btn">
          <button type="submit" className="submit-btn">
            Sign me Up!
          </button>
        </div>
      </form>
    </Layout>
  )
}

export default Subscribe

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
