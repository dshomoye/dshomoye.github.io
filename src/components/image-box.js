import React, { useEffect, useRef } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const Imagebox = ({ name, index, src }) => {
  const bc = useRef(null)
  const data = useStaticQuery(graphql`
  query ImageQuery {
      s3ImageAsset(Key: {eq: "images/end_of_the_trail.jpg"}) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
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

  console.log('data, ', data)

  const showlightbox = () => {
    console.log("sending show cmd, index is", index)
    if (bc.current) bc.current.postMessage(index)
  }

  return (
    <span onClick={showlightbox}>
      <Img fluid={data.s3ImageAsset.childImageSharp.fluid} />
    </span>
  )
}

export default Imagebox
