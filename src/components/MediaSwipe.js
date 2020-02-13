import React from "react"
import Carousel, { Modal, ModalGateway } from "react-images"
import { bucketRoot } from "../utils/constants"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const customView = ({...props}) => {
  const imageZoomOptions = {
    minScale: 0.5
  }
  const src = `${bucketRoot}/${props.data.src}`
  const media = props.data.type === 'video' ? 
    (<video data-src={src} className="lazyload" alt={props.data.caption} width="100%" crossOrigin="anonymous" autoPlay muted controls>
      <track src={`${bucketRoot}/media/first-ride/video.vtt`} default kind="captions" srcLang="en"/>
    </video>) :
    <TransformWrapper
      wheel={{step: 25}}
      options={imageZoomOptions}
      doubleClick={{mode: "reset"}}
    >
      <TransformComponent>
        <img data-src={src} className="lazyload" alt={props.data.caption}/>
      </TransformComponent>
    </TransformWrapper>
  return media
}


/**
 * sources: [{
 *  caption: str
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
