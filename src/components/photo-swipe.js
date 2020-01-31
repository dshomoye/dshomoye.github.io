import React from "react"
import Carousel, { Modal, ModalGateway } from "react-images"


const customView = ({...props}) => {
  return <img data-src={props.data.src} className="lazyload" alt={props.data.src}/>
}

const bucketRoot = "https://dshomoye.nyc3.digitaloceanspaces.com"

const Photoswipe = ({ index, isOpen, closeModal, name, sources }) => {
  if (!sources) return null

  console.log('sources ', sources)

  return (
    <ModalGateway>
      {isOpen ? (
        <Modal onClose={() => closeModal(false)}>
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
