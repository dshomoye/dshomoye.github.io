import React from "react"
import BaseTable, { Column, AutoResizer } from "react-base-table"
import "react-base-table/styles.css"
import Cell from "./Table/Cell"

const components = {
  TableCell: Cell
}

const Table = ({ data, rowKey, columns }) => {
  return (
    <div style={{width: "100%", overflow: "scroll"}}>
      <div style={{ height: "400px" }}>
        <AutoResizer>
          {({ height, width }) => (
            <BaseTable
              fixed
              data={data}
              width={width}
              height={height}
              rowKey={rowKey}
              components={components}
            >
              {columns.map(col => (
                <Column {...col} dataKey={col.key} />
              ))}
            </BaseTable>
          )}
        </AutoResizer>
      </div>
    </div>
  )
}

export default Table
