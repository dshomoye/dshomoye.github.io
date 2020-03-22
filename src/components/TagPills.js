import React from "react"
import PropTypes from "prop-types"

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
        <p className={`post-tag ${pillMap[tagName].class}`}>
          {pillMap[tagName].icon} {tagName}
        </p>
      </div>
    )
  })
  return <div className="pills-container">{pills}</div>
}

TagPills.propTyes = {
  tagName: PropTypes.arrayOf(PropTypes.string),
}

export default TagPills
