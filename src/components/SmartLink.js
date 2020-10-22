import React from "react"
import { Link } from "gatsby"

const SmartLink = ({ href, children }) => {
  if (RegExp('^https?://').test(href)) {
    return (
      <a target="_blank" rel="noreferrer" href={href}>
        {children}
      </a>
    )
  }
  return <Link to={href}>{children}</Link>
}

export default SmartLink
