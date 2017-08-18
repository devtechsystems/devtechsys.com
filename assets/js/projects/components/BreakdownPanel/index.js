import React from 'react'
import RowChart from './RowChart'
import ColorScale from '../../util/ColorScale.js'
import CountUp from 'react-countup'
import Sizebox from 'react-sizebox'
import PieChart from './PieChart'

export default function({ data, bigNumber, colorPalette, title, groupTitle }) {
  const colorScale = new ColorScale(data, colorPalette.colors, colorPalette.noDataColor)

  return (
    <div className='breakdown-panel row'>
      <div className='left-column column medium-5'>
        <CountUp className='number-countup' start={0} end={bigNumber} duration={3} />
        <div className='breakdown-title'>{title}</div>
        <Sizebox className="pie-sizebox">
          <PieChart data={data} title={title} colorScale={colorScale} />
        </Sizebox>
      </div>
      <div className='right-column column medium-10'>
        <div className='breakdown-group-title'>By {groupTitle}</div>
        <Sizebox className="row-chart-sizebox">
          <RowChart
            rowHeight={40}
            data={data}
            colorMapper={(value) => colorScale.getColorFor(value)}
          />
        </Sizebox>
      </div>
    </div>
  )
}
