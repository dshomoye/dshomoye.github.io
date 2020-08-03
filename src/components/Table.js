import React from "react"
import BaseTable, { Column, AutoResizer } from "react-base-table"
import "react-base-table/styles.css"

const Table = ({ data, rowKey, columns }) => {

  return (
    <div style={{ height: "400px" }}>
      <AutoResizer>
        {({ height, width }) => (
          <BaseTable data={data} width={width} height={height} rowKey={rowKey}>
            {columns.map(col => (
              <Column {...col} dataKey={col.key} />
            ))}
          </BaseTable>
        )}
      </AutoResizer>
    </div>
  )
}

export default Table
