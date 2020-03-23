import React from "react"

const SmartLink = (props) => {
  const linkProps = {}
  if (props.href.toLowerCase().startsWith("https")) {
    linkProps.target = "_blank"
    linkProps.rel = "external"
  }
  return (
    <a {...linkProps} href={props.href}>
      {props.children}
    </a>
  )
}

export default SmartLink
