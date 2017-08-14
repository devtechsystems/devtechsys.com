import React from 'react'
import ReactDOM from 'react-dom'
import BreakDownPanel from './components/BreakdownPanel'
import StackedBarChart from './components/StackedBarChart'
import ColorPalette from './util/ColorPalette'
import ColorScale from './util/ColorScale'
import d3 from 'd3'
import lodash from 'lodash'
import * as topojson from 'topojson'
import { PRACTICE_AREAS } from './ColumnNames'
import { reduceSum, reduceCount } from './util/Reduce'
import D3Choropleth from './components/D3Choropleth'


// Make sure each record only has one practice area
// We need this in order to group by practice area because the original data can have multiple practice areas per record
const denormalizePracticeAreas = (data) => {
  let denormalizedData = []
  Object.values(PRACTICE_AREAS).forEach((practiceArea) => {
    const dataFilteredByPracticeArea = data.filter(d => d[practiceArea] === 'x')
    const dataWithSinglePracticeArea = dataFilteredByPracticeArea.map(d => Object.assign(d, { denormalizedPracticeArea: practiceArea}))
    denormalizedData = denormalizedData.concat(dataWithSinglePracticeArea)
  })
  let nonePracticeAreas = data.filter(d => {
    var foundSomePracticeArea = Object.values(PRACTICE_AREAS).some((practiceArea) => d[practiceArea] === 'x')
    return !foundSomePracticeArea
  })
  .map(d => Object.assign(d, { denormalizedPracticeArea: 'None' }))

  return denormalizedData.concat(nonePracticeAreas)
}

const chartDataFormat = (object) => {
  return Object.entries(object).map(([name, value]) => ({ name, value }))
}

import { regionAndPracAreas, practiceAreas } from './test/Data'

document.addEventListener('DOMContentLoaded', () => {
  d3.tsv('/assets/data/projects.tsv', function(data) {
    const projectsGroupedByCountry = lodash.groupBy(data, 'Country')
    const projectsGroupedByRegion = lodash.groupBy(data, 'Region')
    const projectsGroupedByPracticeArea = lodash.groupBy(denormalizePracticeAreas(data), 'denormalizedPracticeArea')
    const testGroupRegions = lodash.groupBy(regionAndPracAreas, 'region')
    const practiceAreaSumsForRegions = lodash.mapValues(testGroupRegions, (projGroup) => {
      // const denormalized = denormalizePracticeAreas(projGroup)
      const groupedByPracticeAreas = lodash.groupBy(projGroup, (project) => project.practiceArea)
      const contractValuesForGroupedPracticeAreas = reduceSum(groupedByPracticeAreas, 'value')

      return contractValuesForGroupedPracticeAreas
    })
    const flattenedPracticeAreaSums = Object.entries(practiceAreaSumsForRegions).map(([regionName, groupedPracticeAreaSums]) => Object.assign({ region: regionName }, groupedPracticeAreaSums))

    const choroplethData = chartDataFormat(reduceCount(projectsGroupedByCountry))
    const getCountryColor = (datum) => {
      return ChoroplethColorScale.getColorFor(datum.value)
    }
    const ChoroplethColorScale = new ColorScale(choroplethData, ColorPalette.colors, ColorPalette.noDataColor)
    d3.json("/assets/data/countries.topo.json", function(error, world) {

      const countriesTopo = topojson.feature(world, world.objects.countries).features;

      const projectsChoropleth = D3Choropleth('projects-choropleth')
        .topojson(countriesTopo)
        .data(choroplethData)
        .colorPalette(ColorPalette)
        .tooltipContent((datum) => `${datum.name}<br/>${datum.value} projects`)
        .draw()
    });

    const pbpaPanel = (
      <BreakDownPanel
        data={chartDataFormat(reduceCount(projectsGroupedByPracticeArea))}
        colorPalette={ColorPalette}
        title='Projects'
        groupTitle='Practice Area'
      />
    )
    const pbrPanel = (
      <BreakDownPanel
        data={chartDataFormat(reduceCount(projectsGroupedByRegion))}
        colorPalette={ColorPalette}
        title='Countries'
        groupTitle='Region'
      />
    )

    const stackedBarChart = (
      <StackedBarChart
        data={regionAndPracAreas}
        xAxisDataKey={'region'}
        stackDataKey={'practiceArea'}
        colorPalette={ColorPalette}
        valueKey={'value'}
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
