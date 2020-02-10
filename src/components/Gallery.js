import React from "react"
import MediaBox from "./MediaBox"
import { Flex, Box } from "reflexbox"

const getmediaArray = (media) => {
  if (typeof(media) === "string") {
    try {
      return JSON.parse(media)
    } catch (e) {
      console.error("Error parsing input ", media, "error: ", e)
      return null
    }
  }
  return media
}

/**
 * 
 * @param {
 * [{
 *    src: string,
 *    name: string,
 *    index: Number,
 *    type: string
 *  }], 
 *  width: Number
 * } prop 
 */
const Gallery = ({ media, width }) => {
  const mediaArray = getmediaArray(media)
  if (!mediaArray) return null
  const boxes = []
  const equalBoxes = ~~(mediaArray.length / width) // int division
  const remainingBoxes = mediaArray.length % width
  for (let index = 0; index < mediaArray.length; index++) {
    const mediaElement = mediaArray[index]
    const boxWidth = index <= equalBoxes * width ? width : remainingBoxes
    boxes.push(
      <Box width={1/boxWidth}>
        <MediaBox {...mediaElement} />
      </Box>
    ) 
  }
  return (
    <Flex flexWrap='wrap'>
      {boxes}
    </Flex>
  )

}

export default Gallery
