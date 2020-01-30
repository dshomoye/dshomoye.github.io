import React, { useEffect, useState, useRef } from "react"
import Carousel, { Modal, ModalGateway } from "react-images"

const Photoswipe = ({ name, sources }) => {
  const [isOpen, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const bc = useRef(null)

  const images = sources.map(source => {
    return { src: source }
  })

  const showImage = e => {
    try {
      setIndex(Number(e.data))
      console.log("showing light box, val passed: ", e)
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

  return (
    <ModalGateway>
      {isOpen ? (
        <Modal onClose={() => setOpen(false)}>
          <Carousel views={images} currentIndex={index} />
        </Modal>
      ) : null}
    </ModalGateway>
  )
}

export default Photoswipe
