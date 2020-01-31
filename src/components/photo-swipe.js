import React, { useEffect, useState, useRef } from "react"
import Carousel, { Modal, ModalGateway } from "react-images"


const customView = ({...props}) => {
  return <img data-src={props.data.src} className="lazyload" />
}

const bucketRoot = "https://dshomoye.nyc3.digitaloceanspaces.com"

const Photoswipe = ({ name, sources }) => {
  const [isOpen, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const bc = useRef(null)
  const showImage = e => {
    try {
      setIndex(Number(e.data))
      setOpen(true)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    bc.current = new BroadcastChannel(name)
    bc.current.onmessage = showImage
    return () => {
      bc.current.close()
    }
  })

  if (!sources) return null

  console.log('sources ', sources)

  return (
    <ModalGateway>
      {isOpen ? (
        <Modal onClose={() => setOpen(false)}>
          <Carousel
            components={{ View: customView }}
            views={sources.map(s => ({ src: `${bucketRoot}/${s}` }))} 
            currentIndex={index} 
          />
        </Modal>
      ) : null}
    </ModalGateway>
  )
}

export default Photoswipe
