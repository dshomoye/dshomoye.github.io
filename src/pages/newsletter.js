/* eslint-disable */
import React, { useState } from "react"
import Layout from "../components/layout"
import { graphql, Link } from "gatsby";
import {BiMailSend} from "react-icons/bi"
import Lottie from "react-lottie"
import checkedAnimationData from "../lotties/checked_done.json"

import SEO from "../components/seo"
import "../styles/Newsletter.css"
import { encodeFormData } from "../utils";


const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: checkedAnimationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
}

const Newsletter = ({ ...props }) => {
  // 0: notSubmit, 1: submitting, 2: submitted, 3: failed
  const [submit, setSubmit] = useState(0)
  const [formData, setFormData] = useState({})

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = e => {
    setSubmit(1)
    e.preventDefault()
    const form = e.target
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeFormData({
        "form-name": form.getAttribute("name"),
        ...formData,
      }),
    })
      .then(() => {
        setSubmit(2)
      })
      .catch(error => {
        setSubmit(3)
      })
  }

  const subscribeForm = (
    <form
      className="form-container"
      autoComplete="on"
      name="subscription"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      data-sal="slide-down"
      data-sal-easing="ease"
      data-sal-duration="700"
    >
      <div className="form-heading">
        <p class="hidden">
          <label>
            Don’t fill this out if you're human: <input name="bot-field" onChange={handleChange} />
          </label>
        </p>
        <input type="hidden" name="form-name" value="subscription" />
        <h1 style={{marginTop: 0}}>Get notified of new updates! <BiMailSend style={{marginBottom: "-8px"}}/></h1>
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
          onChange={handleChange}
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
      <p className="notice">
        BY SIGNING UP, YOU AGREE TO BE CONTACTED BY EMAIL
      </p>
    </form>
  )

  const confirmation = (
    <>
      <h1>Thanks!</h1>
      <p>
        <Lottie options={defaultOptions} height={250} width={250} /> Email
        subscription confirmed.
      </p>
      <p>
        <Link to="/"> Return Home. </Link>
      </p>
    </>
  )

  const failed = <p>An error occured</p>

  let content = subscribeForm

  if (submit === 1) {
    content = <p>Submitting...</p>
  } else if (submit === 2) {
    content = confirmation
  } else if (submit === 3) {
    content = failed
  }

  const siteTitle = props.data.site.siteMetadata.title
  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title="Newsletter Subscription Page"
        description="Sign up for my newsletter to be notified when I have new posts."
      />
      {content}
    </Layout>
  )
}

export default Newsletter

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
