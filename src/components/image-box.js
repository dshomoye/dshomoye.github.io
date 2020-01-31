import React, { useEffect, useRef } from "react"

const bucketRoot = "https://dshomoye.nyc3.digitaloceanspaces.com"

const Imagebox = ({ name, index, src }) => {
  const bc = useRef(null)

  useEffect(() => {
    bc.current = new BroadcastChannel(name)
    return () => {
      bc.current.close()
    }
  })



  const showlightbox = () => {
    if (bc.current) bc.current.postMessage(index)
  }

  return (
    <span onClick={showlightbox}>
      <img data-src={`${bucketRoot}/${src}`} className="lazyload"/>
    </span>
  )
}

export default Imagebox
