import React from 'react'
import RowChart from './RowChart'
import ColorScale from '../../util/ColorScale.js'
import CountUp from 'react-countup'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'

const TooltipContent = function({ active, type, payload, label }) {
  if(!active) return null
  const hoverData = payload[0].payload
  return (
    <div className='tt-content' style={{ width: 200, height: 'auto' }}>
      <div className='tt-label'>{hoverData.name}</div>
      {hoverData.value}
    </div>
  )
}

export default function({ data, bigNumber, colorPalette, title, groupTitle }) {
  const colorScale = new ColorScale(data, colorPalette.colors, colorPalette.noDataColor)

  return (
    <div className='breakdown-panel row'>
      <div className='left-column column medium-5'>
        <CountUp className='number-countup' start={0} end={bigNumber} duration={3} />
        <div className='breakdown-title'>{title}</div>
        <PieChart width={120} height={120} className='breakdown-pie'>
          <Tooltip content={<TooltipContent />} />
          <Pie
            dataKey='value'
            data={data}
            innerRadius={25}
            outerRadius={60}
            cx='50%'
            cy='50%'
            startAngle={90}
            endAngle={-270}
          >
            {data.map((element, index) => <Cell key={element.name} fill={colorScale.getColorFor(data[index].value)} />)}
          </Pie>
        </PieChart>
      </div>
      <div className='right-column column medium-10'>
        <div className='breakdown-group-title'>By {groupTitle}</div>
        <RowChart
          rowHeight={40}
          width={250}
          height={250}
          data={data}
          colorMapper={(value) => colorScale.getColorFor(value)}
        />
      </div>
    </div>
  )
}
