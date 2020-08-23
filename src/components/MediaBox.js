import React, { useContext, useRef } from "react"
import PropTypes from "prop-types"

import { DispatchContext, actionTypes } from "./GalleryContainer"

import { bucketRoot } from "../utils/constants"

const MediaBox = ({ name, index, src, type, noborder }) => {
  const dispath = useContext(DispatchContext)
  const videoRef = useRef(null)

  const showlightbox = e => {
    e.preventDefault()
    if (type !== "video") {
      dispath({
        type: actionTypes.SET_GALLERY_INDEX_AND_SHOW_MODAL,
        payload: { index: index },
      })
    } else {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }
  const mediaSrc = `${bucketRoot}/${src}`
  const imgClassName = noborder === "true" ? `` : `styled-media`
  const containerClassName = noborder === "true" ? `` : `media-container`
  const media =
    type === "video" ? (
      <video
        data-src={mediaSrc}
        className="lazyload"
        width="100%"
        crossOrigin="anonymous"
        controls
        ref={videoRef}
      >
        <track
          src={`${bucketRoot}/media/first-ride/video.vtt`}
          default
          kind="captions"
          srcLang="en"
        />
      </video>
    ) : (
      <img
        data-src={mediaSrc}
        className={`lazyload ${imgClassName}`}
        alt={name}
      />
    )

  return (
    <a onClick={showlightbox} href={mediaSrc}>
      <figure className={containerClassName}>
        {media}
        <figcaption>{name}</figcaption>
      </figure>
    </a>
  )
}

MediaBox.propTypes = {
  name: PropTypes.string,
  index: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["video", "image"]),
  noborder: PropTypes.oneOf(["true", "false"]),
}

export default MediaBox
