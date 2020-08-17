import React from "react"
import BaseTable, { Column, AutoResizer } from "react-base-table"
import "react-base-table/styles.css"
import Cell from "./Cell"

const components = {
  TableCell: Cell,
}

const Table = ({ data, rowKey, columns }) => {
  return (
    <div
      style={{
        width: "100%",
        overflow: "scroll",
        minHeight: "50vh"
      }}
    >
      <div style={{ minHeight: "100px" }}>
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
                <Column
                  {...col}
                  dataKey={col.key}
                  style={{
                    backgroundColor: "var(--bg)",
                    transition: 'background 0.2s ease-out',
                  }}
                />
              ))}
            </BaseTable>
          )}
        </AutoResizer>
      </div>
    </div>
  )
}

export default Table
