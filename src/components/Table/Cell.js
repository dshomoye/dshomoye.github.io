import React from "react"
import SmartLink from "../SmartLink"
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai"

const linkRenderer = ({ rowData, column, cellData }) => (
  <SmartLink href={rowData[column.linkKey]}>
    {column.linkText ? column.linkText : cellData}
  </SmartLink>
)

const stringRenderer = ({ className, cellData }) => {
  return (
    <div className={className}>
      {!cellData ? <AiOutlineLike /> : <AiOutlineDislike />}
    </div>
  )
}

const Cell = props => {
  if (props.column.type === "link") return linkRenderer(props)
  return stringRenderer(props)
}

export default Cell
