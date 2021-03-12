import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const pillMap = {
  technology: {
    class: "red-pill",
    icon: "👨🏿‍💻",
  },
  life: {
    class: "green-pill",
    icon: "💆🏾",
  },
  travel: {
    class: "blue-pill",
    icon: "🗺",
  },
  misc: {
    class: "gray-pill",
    icon: "🌊",
  },
}

const TagPills = ({ tagNames }) => {
  if (!tagNames) return null
  const pills = tagNames.map((tagName, index) => {
    return (
      <div className="post-tag-pill" key={index}>
        <Link to={`/tags/${tagName}`} className="tag-link">
          <p className={`post-tag ${pillMap[tagName].class}`} tabIndex={0}>
            {pillMap[tagName].icon} {tagName}
          </p>
        </Link>
      </div>
    )
  })
  return <div className="pills-container">{pills}</div>
}

TagPills.propTyes = {
  tagName: PropTypes.arrayOf(PropTypes.string),
}

export default TagPills
