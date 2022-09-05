import React from "react"

import PushNotification from "./PushNotification"

import "../styles/SubscribeOptions.css"

const SubscribeOptions = () => {
  return (
    <>
      <div className="items-container">
        <a href="/rss.xml"> RSS </a>| <a href="https://github.com/dshomoye">Github</a>
      </div>
      <PushNotification />
    </>
  )
}

export default SubscribeOptions
