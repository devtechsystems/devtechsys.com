import React from 'react'
import RowChart from './RowChart'
import ColorScale from '../../util/ColorScale.js'
import CountUp from 'react-countup'

export default function({ groupedData, colorPalette, title, groupTitle }) {
  const colorScale = new ColorScale(groupedData, colorPalette.colors, colorPalette.noDataColor)
  const totalValue = groupedData.reduce((accumulated, next) => accumulated += next.value, 0)

  return (
    <div className='breakdown-panel row'>
      <div className='left-column column small-4'>
        <CountUp className='number-countup' start={0} end={totalValue} duration={3} />
        <div className='breakdown-title'>{title}</div>
      </div>
      <div className='right-column column small-8'>
        <div className='breakdown-group-title'>By {groupTitle}</div>
        <RowChart
          rowHeight={40}
          width={300}
          height={400}
          data={groupedData}
          colorMapper={(value) => colorScale.getColorFor(value)}
        />
      </div>
    </div>
  )
}
