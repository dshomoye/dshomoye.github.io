import React from "react"
import { Link } from "gatsby"

import PushNotification from "./PushNotification"

import "../styles/SubscribeOptions.css"



const SubscribeOptions = () => {
  return (
    <>
      <div className="items-container">
        <a href="/rss.xml"> RSS </a>|
        <Link to="/newsletter"> Newsletter </Link>
      </div>
      <PushNotification />
    </>
  )

}


export default SubscribeOptions
