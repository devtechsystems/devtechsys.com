import React from 'react'
import ReactDOM from 'react-dom'
import qdFormatters from 'qd-formatters'
import CountUp from 'react-countup'
import Sizebox from 'react-sizebox'
import BreakDownPanel from './components/BreakdownPanel'
import StackedBarChart from './components/StackedBarChart'
import ColorPalette from './util/ColorPalette'
import ColorScale from './util/ColorScale'
import d3 from 'd3'
import lodash from 'lodash'
import * as topojson from 'topojson'
import { PRACTICE_AREA_COLUMN_NAMES, PRACTICE_AREA_COLUMN_NAME, COUNTRY_COLUMN_NAME, REGION_COLUMN_NAME, PARTNER_COLUMN_NAME, CONTRACT_VALUE_COLUMN_NAME } from './ColumnNames'
import { reduceSum, reduceCount, reduceCountIncludeExtraData } from './util/Reduce'
import D3Choropleth from './components/D3Choropleth'
import ProjectSearch from './components/ProjectSearch'
import PracticeAreaExists from './util/PracticeAreaExists'

const formatters = qdFormatters(d3)

// Make sure each record only has one practice area
// We need this in order to group by practice area because the original data can have multiple practice areas per record
const denormalizePracticeAreas = (data) => {
  let denormalizedData = []
  const practiceAreas = Object.values(PRACTICE_AREA_COLUMN_NAMES)
  practiceAreas.forEach((practiceArea) => {
    const dataFilteredByPracticeArea = data.filter(project => {
      return PracticeAreaExists(practiceArea, project)
    })
    const dataWithSinglePracticeArea = dataFilteredByPracticeArea.map(project => Object.assign({}, project, { denormalizedPracticeArea: practiceArea['displayName']}))
    denormalizedData = denormalizedData.concat(dataWithSinglePracticeArea)
  })
  let nonePracticeAreas = data.filter(project => {
    var foundSomePracticeArea = practiceAreas.some((practiceArea) => {
      return PracticeAreaExists(practiceArea, project)
    })
    return !foundSomePracticeArea
  })
  .map(project => Object.assign({}, project, { denormalizedPracticeArea: 'None' }))

  return denormalizedData.concat(nonePracticeAreas)
}

const chartDataFormat = (groupedValues) => {
  const nameValueArray = Object.entries(groupedValues).map(([name, value]) => ({ name, value }))
  return lodash.sortBy(nameValueArray, ['value']).slice(0).reverse()
}
const choroplethDataFormat = (groupedValues) => {
  const flattenedArray = []
  Object.keys(groupedValues).forEach((iso3Code) => {
    const country = { name: iso3Code, value: groupedValues[iso3Code].count, countryName: groupedValues[iso3Code].countryName}
    flattenedArray.push(country)
  })
  return flattenedArray
}
const choroplethTooltipFunc = (datum) => {
  if(datum.noDataFound) {
    if(datum.noGeoDataFound) {
      return `No data found for ${datum.name}`
    }
    return `${datum.properties.name}<br/>0 projects`
  }
  return`${datum.countryName}<br/>${datum.value} projects`
}

document.addEventListener('DOMContentLoaded', () => {
  const data = JEKYLL_DATA.projectsData
  const totalProjects = data.length
  const totalPartners = Object.keys(lodash.groupBy(data, PARTNER_COLUMN_NAME)).length
  const totalMoney = formatters.bigCurrencyFormat(data.reduce((acc, next) => {
    const contractValue = Number(next[CONTRACT_VALUE_COLUMN_NAME])
    if(isNaN(contractValue)) return acc
    return acc + Number(next[CONTRACT_VALUE_COLUMN_NAME])
  }, 0))
  const projectsGroupedByCountry = lodash.pickBy(lodash.groupBy(data, 'ISO3 Code'), (projects, iso3) => iso3 !== "" && iso3 !== "GBL" && iso3 !== "GLB" && iso3 !== "GLO")
  const totalCountries = Object.keys(projectsGroupedByCountry).length // Don't include Global as a country
  const projectsGroupedByRegion = lodash.groupBy(data, REGION_COLUMN_NAME)
  const countriesInRegions = lodash.mapValues(projectsGroupedByRegion, (projects) => lodash.uniqBy(projects, COUNTRY_COLUMN_NAME).length)
  const dataDenormalizedByPracticeArea = denormalizePracticeAreas(data)
  const projectsGroupedByPracticeArea = lodash.groupBy(dataDenormalizedByPracticeArea, 'denormalizedPracticeArea')
  const projectCountsForCountries = reduceCountIncludeExtraData(projectsGroupedByCountry, (recordGroup) => ({ countryName: recordGroup[0][COUNTRY_COLUMN_NAME] }))
  const choroplethData = choroplethDataFormat(projectCountsForCountries)
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
      .tooltipContent(choroplethTooltipFunc)
      .numberFormatter(formatters.numberFormat)
      .draw()
  });

  const pbpaPanel = (
    <BreakDownPanel
      data={chartDataFormat(reduceCount(projectsGroupedByPracticeArea))}
      bigNumber={totalProjects}
      colorPalette={ColorPalette}
      title='Projects'
      groupTitle='Practice Area'
    />
  )
  const pbrPanel = (
    <BreakDownPanel
      data={chartDataFormat(countriesInRegions)}
      bigNumber={totalCountries}
      colorPalette={ColorPalette}
      title='Countries'
      groupTitle='Region'
    />
  )

  const stackedBarChart = (
    <Sizebox className="stacked-bar-chart-sizebox">
      <StackedBarChart
        data={dataDenormalizedByPracticeArea}
        xAxisDataKey={REGION_COLUMN_NAME}
        stackDataKey={'denormalizedPracticeArea'}
        colorPalette={ColorPalette}
        valueKey={CONTRACT_VALUE_COLUMN_NAME}
        tickFormatter={formatters.bigCurrencyFormat}
        tooltipValueFormatter={formatters.currencyFormat}
      />
    </Sizebox>
  )

  ReactDOM.render(
    <CountUp start={0} end={totalProjects} duration={3} />,
    document.getElementById('projects-count')
  )

  ReactDOM.render(
    <CountUp start={0} end={totalCountries} duration={3} />,
    document.getElementById('countries-count')
  )

  ReactDOM.render(
    <CountUp start={0} end={totalPartners} duration={3} />,
    document.getElementById('partners-count')
  )

  ReactDOM.render(
    <CountUp start={0} end={totalCountries} duration={3} />,
    document.getElementById('countries-count')
  )

  ReactDOM.render(
    <span>{totalMoney}</span>,
    document.getElementById('total-money')
  )

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

  ReactDOM.render(
    <ProjectSearch projects={data} />,
    document.getElementById('project-search')
  )

})
