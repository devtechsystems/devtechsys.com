import React from 'react'
import ReactDOM from 'react-dom'
import RowChart from './components/RowChart.js'

const projectsByPracticeArea = [
  { name: 'Monitoring and Evaluation', value: 184 },
  { name: 'Public Financial Management and Fiscal Sustainability', value: 123 },
  { name: 'Knowledge Management and Data Analytics', value: 85 },
  { name: 'Education, Gender and Youth', value: 37 },
  { name: 'Energy and Environment', value: 12 },
  { name: 'Security, Transparency, and Governence', value: 4 }
]
const pbpaRowChart = (
  <RowChart
    rowHeight={40}
    width={300}
    height={400}
    data={projectsByPracticeArea}
  />
)
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    pbpaRowChart,
    document.getElementById('row-chart-practice-area')
  )
})
