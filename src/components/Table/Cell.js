import React from "react"
import SmartLink from "../SmartLink"

const linkRenderer = ({ rowData, column, cellData }) => (
  <SmartLink href={rowData[column.linkKey]}>
    {column.linkText ? column.linkText : cellData}
  </SmartLink>
)

const stringRenderer = ({ className, cellData }) => (
  <div className={className}>{cellData}</div>
)

const Cell = props => {
  console.log("cell props ", props)
  if (props.column.type === "link") return linkRenderer(props)
  return stringRenderer(props)
}

export default Cell
