import React, { useContext, useRef } from "react"

import { DispatchContext, actionTypes } from "./GalleryContainer"

import { bucketRoot } from "../utils/constants"

const MediaBox = ({ name, index, src, type }) => {
  const dispath = useContext(DispatchContext)
  const videoRef = useRef(null)

  const showlightbox = e => {
    e.preventDefault()
    console.log("handling click for type: ", type)
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
      <img data-src={mediaSrc} className="lazyload styled-media" alt={name} />
    )

  return (
    <a onClick={showlightbox} href={mediaSrc}>
      <figure className="media-contianer">
        {media}
        <figcaption>{name}</figcaption>
      </figure>
    </a>
  )
}

export default MediaBox
