import React from 'react'
import RowChart from './RowChart'
import ColorScale from '../../util/ColorScale.js'
import CountUp from 'react-countup'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'

export default function({ data, colorPalette, title, groupTitle }) {
  const colorScale = new ColorScale(data, colorPalette.colors, colorPalette.noDataColor)
  const totalValue = data.reduce((accumulated, next) => accumulated += next.value, 0)

  return (
    <div className='breakdown-panel row'>
      <div className='left-column column small-4'>
        <CountUp className='number-countup' start={0} end={totalValue} duration={3} />
        <div className='breakdown-title'>{title}</div>
        <PieChart width={100} height={100}>
          <Pie
            dataKey='value'
            data={data}
            innerRadius={20}
            outerRadius={50}
            cx='50%'
            cy='50%'
            startAngle={90}
            endAngle={-270}
          >
            {data.map((element, index) => <Cell key={element.name} fill={colorScale.getColorFor(data[index].value)} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div className='right-column column small-8'>
        <div className='breakdown-group-title'>By {groupTitle}</div>
        <RowChart
          rowHeight={40}
          width={200}
          height={300}
          data={data}
          colorMapper={(value) => colorScale.getColorFor(value)}
        />
      </div>
    </div>
  )
}
