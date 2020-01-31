import React, { useEffect, useRef } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const Imagebox = ({ name, index, src }) => {
  const bc = useRef(null)
  const data = useStaticQuery(graphql`
  query ImageQuery {
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

  useEffect(() => {
    bc.current = new BroadcastChannel(name)
    return () => {
      bc.current.close()
    }
  })

  const imageData = data.allS3ImageAsset.nodes.find(im => im.Key === src)


  const showlightbox = () => {
    if (bc.current) bc.current.postMessage(index)
  }

  if (!imageData) return null

  return (
    <span onClick={showlightbox}>
      <Img fluid={imageData.childImageSharp.fluid} />
    </span>
  )
}

export default Imagebox
