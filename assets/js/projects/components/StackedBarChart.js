import React from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import lodash from 'lodash'
import { reduceSum } from '../util/Reduce'
import { PRACTICE_AREAS } from '../ColumnNames'

const sortStringsAsc = (a, b) => {
  const aLower = a.toLowerCase()
  const bLower = b.toLowerCase()
  if(aLower < bLower) return -1
  if(aLower > bLower) return 1
  return 0
}

const TooltipContent = function({ active, type, payload, label, xAxisDataKey, colorMapper }) {
  if(!active) return null
  const hoverData = payload[0].payload
  const xAxisValue = hoverData[xAxisDataKey]
  const stackData = Object.keys(hoverData).sort(sortStringsAsc)
    .filter((key) => key !== xAxisDataKey)
    .map((stackDataName) => {
      return { 
        name: stackDataName,
        value: hoverData[stackDataName],
        color: colorMapper[stackDataName]
      }
    })
  const stackContent = stackData.map((slice) => {
    return (
      <div key={`${xAxisValue}-${slice.name}`} className='stack-slice-content'>
        <svg width={20} height={20}><circle cx={10} cy={10} r={10} fill={slice.color} /></svg>
        <span className='stack-slice-name'>{slice.name}</span>
        <div className='stack-slice-value'>{slice.value}</div>
      </div>
    )
  })

  return (
    <div className='tt-content' style={{ width: 350, height: 'auto' }}>
      <div className='tt-title'>{xAxisValue}</div>
      <div className='tt-label'>{hoverData.name}</div>
      {stackContent}
    </div>
  )
}

export default function({ data, xAxisDataKey, stackDataKey, colorPalette, valueKey = 'value' }) {
  const colorsDarkToLight = colorPalette.colors.slice(0).reverse() // Clone then reverse
  const xGrouping = lodash.groupBy(data, xAxisDataKey)
  const xGroupingWithSums = lodash.mapValues(xGrouping, (collectionForXGroup) => {
    const stackGrouping = lodash.groupBy(collectionForXGroup, stackDataKey)
    const stackGroupingWithSums = reduceSum(stackGrouping, valueKey)
    return stackGroupingWithSums
  })
  const flattenedGroupings = Object.entries(xGroupingWithSums).map(([xName, stackGrouping]) => Object.assign({ [xAxisDataKey]: xName }, stackGrouping))
  const stackDataNamesAsc = lodash.uniqBy(data, stackDataKey)
  .map((d) => d[stackDataKey])
  .sort(sortStringsAsc)
  const colorMapper = {}
  stackDataNamesAsc.forEach((name, index) => colorMapper[name] = colorsDarkToLight[index])
  const stackDataNamesDesc = stackDataNamesAsc.slice(0).reverse() // Clone and then reverse
  const stackedBar = stackDataNamesDesc.map((name, stackIndex) => {
    return (
      <Bar key={`bar-${name}`} dataKey={name} stackId='samestack'>
        {
          flattenedGroupings.map((element, index) => (
            <Cell 
              key={`stacked-bar-${element.region}-${index}`} 
              fill={colorMapper[name]}
            />
          ))
        }
      </Bar>
    )
  })
  const legendData = stackDataNamesAsc.map((name, index) => ({ id: name, value: name, color: colorMapper[name] }))

  return (
    <BarChart width={1100} height={400} data={flattenedGroupings}>
      <XAxis dataKey={xAxisDataKey} />
      <YAxis />
      <Tooltip cursor={{ stroke: '#ddd', strokeWidth: 1, fill: 'white' }} content={<TooltipContent colorMapper={colorMapper} xAxisDataKey={xAxisDataKey} />} active={true} />
      <Legend iconType='circle' payload={legendData} />
     {stackedBar}
    </BarChart>
  )
}
