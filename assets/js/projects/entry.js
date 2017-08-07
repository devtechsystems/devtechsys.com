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



const projectsByRegion = [
  { name: 'East Asia & Oceania', value: 184 },
  { name: 'Middle East & North Africa', value: 123 },
  { name: 'South & Central Asia', value: 85 },
  { name: 'Sub-Saharan Africa', value: 37 },
  { name: 'Western Hemisphere', value: 12 },
  { name: 'World', value: 9 }
]
const pbrPanel = (
  <BreakDownPanel
    groupedData={projectsByRegion}
    colorPalette={ColorPalette}
    title='Countries'
    groupTitle='Region'
  />
)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    pbpaPanel,
    document.getElementById('projects-by-practice-area')
  )

  ReactDOM.render(
    pbrPanel,
    document.getElementById('projects-by-region')
  )
})
