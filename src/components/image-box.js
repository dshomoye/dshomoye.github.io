import React, { useEffect, useRef } from "react"

const Imagebox = ({ name, index, src }) => {
  const bc = useRef(null)

  useEffect(() => {
    bc.current = new BroadcastChannel(name)
    return () => {
      bc.current.close()
    }
  })

  const showlightbox = () => {
    console.log("sending show cmd, index is", index)
    if (bc.current) bc.current.postMessage(index)
  }

  return (
    <span onClick={showlightbox}>
      <img src={src} />
    </span>
  )
}

export default Imagebox
