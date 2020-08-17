import { useState, useEffect } from "react"
import { isClient } from "../utils"

const useViewSize = () => {
  const [width, setWidth] = useState(isClient ? window.innerWidth : 0)
  const [height, setHeight] = useState(isClient ? window.innerHeight : 0)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  return { height, width }
}

export default useViewSize
