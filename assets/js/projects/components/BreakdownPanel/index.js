import React from 'react'
import RowChart from './RowChart'
import ColorScale from '../../util/ColorScale.js'
import CountUp from 'react-countup'
import { PieChart, Pie, Cell } from 'recharts'

export default function({ groupedData, colorPalette, title, groupTitle }) {
  const colorScale = new ColorScale(groupedData, colorPalette.colors, colorPalette.noDataColor)
  const totalValue = groupedData.reduce((accumulated, next) => accumulated += next.value, 0)

  return (
    <div className='breakdown-panel row'>
      <div className='left-column column small-4'>
        <CountUp className='number-countup' start={0} end={totalValue} duration={3} />
        <div className='breakdown-title'>{title}</div>
        <PieChart width={100} height={100}>
          <Pie
            dataKey='value'
            data={groupedData}
            innerRadius={20}
            outerRadius={50}
            cx='50%'
            cy='50%'
            startAngle={90}
            endAngle={-270}
          >
            {groupedData.map((element, index) => <Cell key={element.name} fill={colorScale.getColorFor(groupedData[index].value)} />)}
          </Pie>
        </PieChart>
      </div>
      <div className='right-column column small-8'>
        <div className='breakdown-group-title'>By {groupTitle}</div>
        <RowChart
          rowHeight={40}
          width={200}
          height={300}
          data={groupedData}
          colorMapper={(value) => colorScale.getColorFor(value)}
        />
      </div>
    </div>
  )
}
