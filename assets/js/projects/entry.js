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
import { PRACTICE_AREA_COLUMN_NAMES, PRACTICE_AREA_COLUMN_NAME, COUNTRY_COLUMN_NAME, REGION_COLUMN_NAME, PARTNER_COLUMN_NAME, CONTRACT_VALUE_COLUMN_NAME, SEARCH_REFERENCE_ID_COLUMN_NAME, ISO_3_COlUMN_NAME } from './ColumnNames'
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

  return denormalizedData // .concat(nonePracticeAreas) // Unecessary to include None as a practice area
}

const chartDataFormat = (groupedValues) => {
  const nameValueArray = Object.entries(groupedValues).map(([name, value]) => ({ name, value }))
  return lodash.sortBy(nameValueArray, ['value']).slice(0).reverse()
}
const choroplethDataFormat = (groupedValues) => {
  const flattenedArray = []
  Object.keys(groupedValues).forEach((iso3Code) => {
    const country = { name: iso3Code, value: groupedValues[iso3Code] }
    flattenedArray.push(country)
  })
  return flattenedArray
}
const choroplethTooltipFunc = (datum) => {
  if(datum.noDataFound) {
    if(datum.noGeoDataFound) {
      return `No data found for Country`
    }
    return `${datum.geoData.properties.name}<br/>0 solutions`
  }
  return`${datum.geoData.properties.name}<br/>${datum.value} solutions`
}

// A Project has multiple solutions
// A solution is a Project in a country, eg: a Project in 3 countries is equivalent to 3 solutions
const denormalizeProjectsIntoSolutions = (projects) => {
  const solutions = []
  projects.forEach((p) => {
    if(p[ISO_3_COlUMN_NAME].length === 0) {
      solutions.push(p)
    } else {
      p[ISO_3_COlUMN_NAME].forEach((isoCode) => {
        const solution = Object.assign({}, p, { [ISO_3_COlUMN_NAME]: isoCode })
        solutions.push(solution)
      })
    }
  })

  return solutions
}

document.addEventListener('DOMContentLoaded', () => {
  const projects = JEKYLL_DATA.projectsData.map((d, i) => {
    return Object.assign({}, d, { [SEARCH_REFERENCE_ID_COLUMN_NAME]: i })
  })//.filter((p) => p[REGION_COLUMN_NAME].indexOf('Latin') === -1) // Remove latin america to see how stacked bar chart looks
  const solutions = denormalizeProjectsIntoSolutions(projects) 
  const totalSolutions = solutions.length
  const totalPartners = Object.keys(lodash.groupBy(projects, PARTNER_COLUMN_NAME)).length
  const totalMoney = formatters.bigCurrencyFormat(projects.reduce((acc, next) => {
    // Important that we iterate over 'projects' and not 'solutions', solutions would be double counting money
    const contractValue = Number(next[CONTRACT_VALUE_COLUMN_NAME])
    if(isNaN(contractValue)) return acc
    return acc + Number(next[CONTRACT_VALUE_COLUMN_NAME])
  }, 0))
  const solutionsGroupedByCountry = lodash.groupBy(solutions, ISO_3_COlUMN_NAME)
  const totalCountries = Object.keys(solutionsGroupedByCountry).filter((isoCode) => isoCode !== "").length // Don't include countries that are unknown or global
  const projectsGroupedByRegion = lodash.groupBy(projects, REGION_COLUMN_NAME)
  const solutionsGroupedByRegion = lodash.groupBy(solutions, REGION_COLUMN_NAME)
  const countriesInRegions = lodash.mapValues(solutionsGroupedByRegion, (sgbr) => lodash.uniqBy(sgbr, ISO_3_COlUMN_NAME).length)
  const projectsDenormalizedByPracticeArea = denormalizePracticeAreas(projects)
  const solutionsDenormalizedByPracticeArea = denormalizePracticeAreas(solutions)
  const projectsGroupedByPracticeArea = lodash.groupBy(projectsDenormalizedByPracticeArea, 'denormalizedPracticeArea')
  const solutionsGroupedByPracticeArea = lodash.groupBy(solutionsDenormalizedByPracticeArea, 'denormalizedPracticeArea')
  const solutionCountsForCountries = reduceCount(solutionsGroupedByCountry)

  const choroplethData = choroplethDataFormat(solutionCountsForCountries)
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
      data={chartDataFormat(reduceCount(solutionsGroupedByPracticeArea))}
      bigNumber={totalSolutions}
      colorPalette={ColorPalette}
      title='Solutions'
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
        data={projectsDenormalizedByPracticeArea}
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
    <CountUp start={0} end={totalSolutions} duration={3} />,
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
    <ProjectSearch projects={projects} />,
    document.getElementById('project-search')
  )

})
