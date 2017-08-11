import React from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import lodash from 'lodash'
import { reduceSum } from '../util/Reduce'
import { PRACTICE_AREAS } from '../ColumnNames'

export default function({ data, xAxisDataKey, stackDataKey, colorPalette, valueKey = 'value' }) {
  const colorsLightToDark = colorPalette.colors
  const colorsDarkToLight = colorsLightToDark.slice(0).reverse() // Clone then reverse
  const xGrouping = lodash.groupBy(data, xAxisDataKey)
  const xGroupingWithSums = lodash.mapValues(xGrouping, (collectionForXGroup) => {
    const stackGrouping = lodash.groupBy(collectionForXGroup, stackDataKey)
    const stackGroupingWithSums = reduceSum(stackGrouping, valueKey)
    return stackGroupingWithSums
  })
  const flattenedGroupings = Object.entries(xGroupingWithSums).map(([xName, stackGrouping]) => Object.assign({ [xAxisDataKey]: xName }, stackGrouping))
  const stackDataNamesAsc = lodash.uniqBy(data, stackDataKey)
  .map((d) => d[stackDataKey])
  .sort((a, b) => {
    const stackNameA = a.toLowerCase()
    const stackNameB = b.toLowerCase()
    if(stackNameA < stackNameB) return -1
    if(stackNameA > stackNameB) return 1
    return 0
  })
  const stackDataNamesDesc = stackDataNamesAsc.slice(0).reverse() // Clone and then reverse
  const stackedBar = stackDataNamesDesc.map((name, stackIndex) => {
    return (
      <Bar key={`bar-${name}`} dataKey={name} stackId='samestack'>
        {
          flattenedGroupings.map((element, index) => (
            <Cell 
              key={`stacked-bar-${element.region}-${index}`} 
              fill={colorsLightToDark[stackIndex]}
            />
          ))
        }
      </Bar>
    )
  })
  const legendData = stackDataNamesAsc.map((name, index) => ({ id: name, value: name, color: colorsDarkToLight[index] }))
  return (
    <BarChart width={800} height={400} data={flattenedGroupings}>
      <XAxis dataKey={xAxisDataKey} />
      <YAxis />
      <Tooltip />
      <Legend iconType='circle' payload={legendData} />
     {stackedBar}
    </BarChart>
  )
}
