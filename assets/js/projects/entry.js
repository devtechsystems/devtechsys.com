import React from 'react'
import ReactDOM from 'react-dom'
import BreakDownPanel from './components/BreakdownPanel'
import StackedBarChart from './components/StackedBarChart'
import ColorPalette from './util/ColorPalette'
import d3 from 'd3'
import lodash from 'lodash'
import { PRACTICE_AREAS } from './ColumnNames'

const projectsByPracticeArea = [
  { name: 'Monitoring and Evaluation', value: 184 },
  { name: 'Public Financial Management and Fiscal Sustainability', value: 123 },
  { name: 'Knowledge Management and Data Analytics', value: 85 },
  { name: 'Education, Gender and Youth', value: 37 },
  { name: 'Energy and Environment', value: 12 },
  { name: 'Security, Transparency, and Governence', value: 4 }
]



const projectsByRegion = [
  { name: 'East Asia & Oceania', value: 184 },
  { name: 'Middle East & North Africa', value: 123 },
  { name: 'South & Central Asia', value: 85 },
  { name: 'Sub-Saharan Africa', value: 37 },
  { name: 'Western Hemisphere', value: 12 },
  { name: 'World', value: 9 }
]

const contractValue = [
  { region: 'East Asia & Oceania', practiceArea: 'Monitoring and Evaluation', value: 550 },
  { region: 'East Asia & Oceania', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 },
  { region: 'East Asia & Oceania', practiceArea: 'Knowledge Management and Data Analytics', value: 350 },
  { region: 'East Asia & Oceania', practiceArea: 'Education, Gender and Youth', value: 250 },
  { region: 'East Asia & Oceania', practiceArea: 'Energy and Environment', value: 100 },
  { region: 'East Asia & Oceania', practiceArea: 'Security, Transparency, and Governance', value: 50 },

  { region: 'Middle East & North Africa', practiceArea: 'Monitoring and Evaluation', value: 550 },
  { region: 'Middle East & North Africa', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 },
  { region: 'Middle East & North Africa', practiceArea: 'Knowledge Management and Data Analytics', value: 350 },
  { region: 'Middle East & North Africa', practiceArea: 'Education, Gender and Youth', value: 250 },
  { region: 'Middle East & North Africa', practiceArea: 'Energy and Environment', value: 100 },
  { region: 'Middle East & North Africa', practiceArea: 'Security, Transparency, and Governance', value: 50 },

  { region: 'South & Central Asia', practiceArea: 'Monitoring and Evaluation', value: 550 },
  { region: 'South & Central Asia', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 },
  { region: 'South & Central Asia', practiceArea: 'Knowledge Management and Data Analytics', value: 350 },
  { region: 'South & Central Asia', practiceArea: 'Education, Gender and Youth', value: 250 },
  { region: 'South & Central Asia', practiceArea: 'Energy and Environment', value: 100 },
  { region: 'South & Central Asia', practiceArea: 'Security, Transparency, and Governance', value: 50 },

  { region: 'Sub-Saharan Africa', practiceArea: 'Monitoring and Evaluation', value: 550 },
  { region: 'Sub-Saharan Africa', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 },
  { region: 'Sub-Saharan Africa', practiceArea: 'Knowledge Management and Data Analytics', value: 350 },
  { region: 'Sub-Saharan Africa', practiceArea: 'Education, Gender and Youth', value: 250 },
  { region: 'Sub-Saharan Africa', practiceArea: 'Energy and Environment', value: 100 },
  { region: 'Sub-Saharan Africa', practiceArea: 'Security, Transparency, and Governance', value: 50 },

  { region: 'Western Hemisphere', practiceArea: 'Monitoring and Evaluation', value: 550 },
  { region: 'Western Hemisphere', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 },
  { region: 'Western Hemisphere', practiceArea: 'Knowledge Management and Data Analytics', value: 350 },
  { region: 'Western Hemisphere', practiceArea: 'Education, Gender and Youth', value: 250 },
  { region: 'Western Hemisphere', practiceArea: 'Energy and Environment', value: 100 },
  { region: 'Western Hemisphere', practiceArea: 'Security, Transparency, and Governance', value: 50 },

  { region: 'World', practiceArea: 'Monitoring and Evaluation', value: 550 },
  { region: 'World', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 },
  { region: 'World', practiceArea: 'Knowledge Management and Data Analytics', value: 350 },
  { region: 'World', practiceArea: 'Education, Gender and Youth', value: 250 },
  { region: 'World', practiceArea: 'Energy and Environment', value: 100 },
  { region: 'World', practiceArea: 'Security, Transparency, and Governance', value: 50 },

  { region: 'Others', practiceArea: 'Monitoring and Evaluation', value: 550 },
  { region: 'Others', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 },
  { region: 'Others', practiceArea: 'Knowledge Management and Data Analytics', value: 350 },
  { region: 'Others', practiceArea: 'Education, Gender and Youth', value: 250 },
  { region: 'Others', practiceArea: 'Energy and Environment', value: 100 },
  { region: 'Others', practiceArea: 'Security, Transparency, and Governance', value: 50 },
]

// Make sure each record only has one practice area
// We need this in order to group by practice area because the original data can have multiple practice areas per record
const denormalizePracticeAreas = (data) => {
  let denormalizedData = []
  Object.entries(PRACTICE_AREAS).forEach(([key, practiceArea]) => {
    const dataFilteredByPracticeArea = data.filter(d => d[practiceArea] == 'x')
    const dataWithSinglePracticeArea = dataFilteredByPracticeArea.map(d => Object.assign(d, { denormalizedPracticeArea: practiceArea}))
    denormalizedData = denormalizedData.concat(dataWithSinglePracticeArea)
  })

  return denormalizedData
}

document.addEventListener('DOMContentLoaded', () => {
  d3.tsv('/assets/data/projects.tsv', function(data) {
    
    const projectsGroupedByRegion = lodash.groupBy(data, (project) => project['Region'])
    const projectsGroupedByPracticeArea = lodash.groupBy(denormalizePracticeAreas(data), (project) => project.denormalizedPracticeArea)

    const pbpaPanel = (
      <BreakDownPanel
        groupedData={projectsByPracticeArea}
        colorPalette={ColorPalette}
        title='Projects'
        groupTitle='Practice Area'
      />
    )
    const pbrPanel = (
      <BreakDownPanel
        groupedData={projectsByRegion}
        colorPalette={ColorPalette}
        title='Countries'
        groupTitle='Region'
      />
    )
    const stackedBarChart = (
      <StackedBarChart
        data={contractValue}
        colorPalette={ColorPalette}
      />
    )
    console.log('data loaded')

    ReactDOM.render(
      pbpaPanel,
      document.getElementById('projects-by-practice-area')
    )

    ReactDOM.render(
      pbrPanel,
      document.getElementById('projects-by-region')
    )

    ReactDOM.render(
      stackedBarChart,
      document.getElementById('contract-value')
    )
  })

})
