import React from 'react'
import ReactDOM from 'react-dom'
import RowChart from './components/RowChart.js'
import ColorScale from './util/ColorScale.js'

const colorPallete = [
  'rgb(112, 189, 219)',
  'rgb(78, 166, 199)',
  'rgb(46, 143, 180)',
  'rgb(33, 111, 141)',
  'rgb(28, 81, 103)',
  'rgb(15, 45, 61)'
]
const projectsByPracticeArea = [
  { name: 'Monitoring and Evaluation', value: 184 },
  { name: 'Public Financial Management and Fiscal Sustainability', value: 123 },
  { name: 'Knowledge Management and Data Analytics', value: 85 },
  { name: 'Education, Gender and Youth', value: 37 },
  { name: 'Energy and Environment', value: 12 },
  { name: 'Security, Transparency, and Governence', value: 4 }
]
const pbpaColorScale = new ColorScale(
  projectsByPracticeArea,
  colorPallete
)

const pbpaRowChart = (
  <RowChart
    rowHeight={40}
    width={300}
    height={400}
    data={projectsByPracticeArea}
    colorMapper={(value) => pbpaColorScale.getColorFor(value)}
  />
)
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    pbpaRowChart,
    document.getElementById('row-chart-practice-area')
  )
})
