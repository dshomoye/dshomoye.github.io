import React, { useState, useEffect } from "react"
import { bucketRoot } from "../utils/constants"
import Lightbox from "react-image-lightbox"
import PropTypes from "prop-types"

/**
 * sources: [{
 *  caption: str
 *  src: str
 *  type: "video"|"image"
 * }]
 * @param {*} param0
 */
const MediaSwipe = ({ index, isOpen, closeModal, sources }) => {
  const [currentIndex, setIndex] = useState(index)
  useEffect(() => {
    setIndex(index)
  }, [index])

  if (!sources) return null
  const nextIndex = (currentIndex + 1) % sources.length
  const prevIndex = (currentIndex + sources.length - 1) % sources.length

  return (
    isOpen && (
      <Lightbox
        mainSrc={`${bucketRoot}/${sources[currentIndex].src}`}
        nextSrc={`${bucketRoot}/${sources[nextIndex].src}`}
        prevSrc={`${bucketRoot}/${sources[prevIndex].src}`}
        onCloseRequest={closeModal}
        onMoveNextRequest={() => setIndex(nextIndex)}
        onMovePrevRequest={() => setIndex(prevIndex)}
        imageCaption={sources[currentIndex].caption}
      />
    )
  )
}

MediaSwipe.propTypes = {
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  sources: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string
}

export default MediaSwipe
