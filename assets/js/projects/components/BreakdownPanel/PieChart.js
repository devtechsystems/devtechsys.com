import React from 'react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'

const TooltipContent = function({ active, type, payload, label, valueName }) {
  if(!active) return null
  const hoverData = payload[0].payload
  return (
    <div className='tt-content' style={{ width: 200, height: 'auto' }}>
      <div className='tt-label'>{hoverData.name}</div>
      {hoverData.value} {valueName}
    </div>
  )
}

export default function({ width, height, data, title, colorScale }) {
  const outerRadius = (width > height) ? height / 2 : width / 2
  const innerRadius = outerRadius * .4
  return (
    <PieChart width={width} height={height} className='breakdown-pie'>
      <Tooltip content={<TooltipContent valueName={title} />} />
      <Pie
        dataKey='value'
        data={data}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        cx='50%'
        cy='50%'
        startAngle={90}
        endAngle={-270}
      >
        {data.map((element, index) => <Cell key={element.name} fill={colorScale.getColorFor(data[index].value)} />)}
      </Pie>
    </PieChart>
  )
}
