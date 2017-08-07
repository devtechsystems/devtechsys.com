import React from 'react'
import ReactDOM from 'react-dom'
import BreakDownPanel from './components/BreakdownPanel'
import ColorPalette from './util/ColorPalette'

const projectsByPracticeArea = [
  { name: 'Monitoring and Evaluation', value: 184 },
  { name: 'Public Financial Management and Fiscal Sustainability', value: 123 },
  { name: 'Knowledge Management and Data Analytics', value: 85 },
  { name: 'Education, Gender and Youth', value: 37 },
  { name: 'Energy and Environment', value: 12 },
  { name: 'Security, Transparency, and Governence', value: 4 }
]

const pbpaPanel = (
  <BreakDownPanel
    groupedData={projectsByPracticeArea}
    colorPalette={ColorPalette}
    title='Projects'
    groupTitle='Practice Area'
  />
)
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    pbpaPanel,
    document.getElementById('row-chart-practice-area')
  )
})
