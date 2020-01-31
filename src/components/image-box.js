import React, { useContext } from "react"

import { DispatchContext, actionTypes } from "./GalleryContainer"

const bucketRoot = "https://dshomoye.nyc3.digitaloceanspaces.com"

const Imagebox = ({ name, index, src }) => {
  const dispath = useContext(DispatchContext)

  const showlightbox = () => {
    dispath({type: actionTypes.SET_GALLERY_INDEX_AND_SHOW_MODAL, payload: { index: index }})
  }

  return (
    <span onClick={showlightbox}>
      <img data-src={`${bucketRoot}/${src}`} className="lazyload" alt={src}/>
    </span>
  )
}

export default Imagebox
