import React, { useContext } from "react"

import { DispatchContext, actionTypes } from "./GalleryContainer"

const bucketRoot = "https://dshomoye.nyc3.digitaloceanspaces.com"

const MediaBox = ({ name, index, src, type }) => {
  const dispath = useContext(DispatchContext)

  const showlightbox = (e) => {
    e.preventDefault()
    dispath({type: actionTypes.SET_GALLERY_INDEX_AND_SHOW_MODAL, payload: { index: index }})
  }

  const mediaSrc = `${bucketRoot}/${src}`
  const media = type === "video" ? 
          <video data-src={mediaSrc} className="lazyload" width='680px' controls muted/> :
          <img data-src={mediaSrc} className="lazyload" alt={name}/>

  return (
    <a onClick={showlightbox} href={mediaSrc}>
      <figure>
        {media}
        <figcaption>{name}</figcaption>
      </figure>
    </a>
  )
}

export default MediaBox
