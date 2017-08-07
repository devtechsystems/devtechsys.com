import React from 'react'
import RowChart from './RowChart'
import ColorScale from '../../util/ColorScale.js'

export default function({ groupedData, colorPalette, title, groupTitle }) {
  const colorScale = new ColorScale(groupedData, colorPalette.colors, colorPalette.noDataColor)

  return (
    <RowChart
      rowHeight={40}
      width={300}
      height={400}
      data={groupedData}
      colorMapper={(value) => colorScale.getColorFor(value)}
    />
  )
}
