import React from "react"
import Carousel, { Modal, ModalGateway } from "react-images"

const bucketRoot = "https://dshomoye.nyc3.digitaloceanspaces.com"

const customView = ({...props}) => {
  const src = `${bucketRoot}/${props.data.src}`
  const media = props.data.type === 'video' ? 
    (<video data-src={src} className="lazyload" alt={props.data.name} width="100%" controls>
      <track src={`${bucketRoot}/images/first-ride/video.vtt`} default kind="captions" srclang="en"/>
    </video>) :
    <img data-src={src} className="lazyload" alt={props.data.name}/>
  return media
}


/**
 * sources: [{
 *  name: str
 *  src: str
 *  type: "video"|"image"
 * }]
 * @param {*} param0 
 */
const MediaSwipe = ({ index, isOpen, closeModal, sources }) => {
  if (!sources) return null


  return (
    <ModalGateway>
      {isOpen ? (
        <Modal onClose={() => closeModal(false)}>
          <Carousel
            components={{ View: customView }}
            views={sources} 
            currentIndex={index} 
          />
        </Modal>
      ) : null}
    </ModalGateway>
  )
}

export default MediaSwipe
