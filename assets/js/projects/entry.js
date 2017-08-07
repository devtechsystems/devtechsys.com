import React from 'react'
import ReactDOM from 'react-dom'
import RowChart from './components/RowChart.js'
import ColorScale from './util/ColorScale.js'

const colorPallete = [
  '#62AFD1',
  '#3D98C3',
  '#297DA6',
  '#1F5D7B',
  '#173F53',
  '#0E242F'
]
const noDataColor = '#87C6DD'
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
  colorPallete,
  noDataColor
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
