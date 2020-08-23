import React from "react"
import { Link } from "gatsby"

import PushNotification from "./PushNotification"

import "../styles/SubscribeOptions.css"

const SubscribeOptions = () => {
  return (
    <>
      <div className="items-container">
        <a href="/rss.xml"> RSS </a>|<Link to="/newsletter"> Newsletter </Link>{" "}
        | <a href="https://github.com/dshomoye">Github</a>
      </div>
      <PushNotification />
    </>
  )
}

export default SubscribeOptions
