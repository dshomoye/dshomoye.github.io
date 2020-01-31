import React, { useEffect, useState, useRef } from "react"
import Carousel, { Modal, ModalGateway } from "react-images"
import Img from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"


const customView = ({...props}) => {
  return <Img fluid={props.data.childImageSharp.fluid} />
}

const Photoswipe = ({ name, sources }) => {
  const [isOpen, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const bc = useRef(null)
  const data = useStaticQuery(graphql`
  query carouselImageQuery {
    allS3ImageAsset(filter: {Key: {regex: "images/"}}) {
      nodes {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
        Key
      }
    }
    }`
  )

  const images = sources.map(source => {
    return { src: source }
  })

  const fluidData = data.allS3ImageAsset.nodes.filter(imgData => sources.includes(imgData.Key))

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

  return (
    <ModalGateway>
      {isOpen ? (
        <Modal onClose={() => setOpen(false)}>
          <Carousel
            components={{ View: customView }}
            views={fluidData} 
            currentIndex={index} 
          />
        </Modal>
      ) : null}
    </ModalGateway>
  )
}

export default Photoswipe
