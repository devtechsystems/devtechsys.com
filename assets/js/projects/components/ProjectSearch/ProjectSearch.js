import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Lunr from 'lunr'
import PageSelector from './PageSelector'
import { PracticeAreaTitle } from '../../util/Humanify'
import { SEARCH_FIELDS } from './SearchFields'
import { COUNTRY_COLUMN_NAME, PRACTICE_AREA_COLUMN_NAMES, PROJECT_TITLE_COLUMN_NAME, ID_COLUMN_NAME } from '../../ColumnNames'

export default class ProjectSearch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchInput: '',
      totalResults: [],
      pagedResults: [],
      currentPage: 1,
      totalNumberOfPages: 0
    }

    this.searchIndex = Lunr(function() {
      this.ref(props.searchReferenceField)
      Object.values(props.searchFields).forEach((searchField) => {
        const fieldName = searchField.name
        const fieldWeight = searchField.weight
        this.field(fieldName, fieldWeight)
      })
      this.pipeline.remove(Lunr.stemmer)

      props.projects.forEach((project) => {
        this.add(project)
      })
    })

    // Give 'this' scope to functions
    this.handleChange = this.handleChange.bind(this)
    this.getTotalResults = this.getTotalResults.bind(this)
    this.getPagedData = this.getPagedData.bind(this)
    this.goToNextPage = this.goToNextPage.bind(this)
    this.goToPreviousPage = this.goToPreviousPage.bind(this)
    this.getTotalNumberOfPages = this.getTotalNumberOfPages.bind(this)
  }

  componentWillMount() {
    const totalResults = this.getTotalResults(this.state.searchInput)
    const pagedResults = this.getPagedData(totalResults, this.state.currentPage)
    // Set the initial results set
    this.setState({ 
      totalResults,
      pagedResults,
      totalNumberOfPages: this.getTotalNumberOfPages(totalResults, this.props.showCount)
    })
  }

  getPracticeAreasMarkup(record) {
    const practiceAreas = Object.values(PRACTICE_AREA_COLUMN_NAMES).filter((paColumnName) => record[paColumnName] === 'x')
    let markup = practiceAreas
      .map((practiceArea, i) => {
        const separator = (i + 1 < practiceAreas.length) ? ' / ' : ''

        return (
          <span key={practiceArea} className='subtitle'>{`${PracticeAreaTitle(practiceArea)}${separator}`}</span>
        )
      })

    if(markup.length === 0) return <span>Practice Area Unavailable</span>
    return markup
  }

  getPagedData(data, pageNumber) {
    if(data.length <= this.props.showCount) {
      return data
    }

    const zeroedPageIndex = pageNumber - 1
    const startIndex = this.props.showCount * zeroedPageIndex
    const endIndex = startIndex + this.props.showCount
    return data.slice(startIndex, endIndex)
  }

  getTotalResults(searchInput) {
    const resultsRefs = this.searchIndex.search(`*${searchInput}*`).map((result) => result.ref)
    const resultsRecords = resultsRefs.map((ref) => {
      return this.props.projects.find((project) => project[this.props.searchReferenceField] === ref)
    })
    return resultsRecords
  }

  resultsMarkup(resultsRecords) {
    const resultsMarkup = resultsRecords.map((record) => {
      return (
        <li key={record[ID_COLUMN_NAME]}><span className="project-country pull-right">{record[COUNTRY_COLUMN_NAME]}</span><span className="project-category">{this.getPracticeAreasMarkup(record)}</span><a href="#" className="project-title">{record[PROJECT_TITLE_COLUMN_NAME]}</a></li>
      )
    })
    return resultsMarkup
  }

  handleChange(event) {
    const searchInput = event.target.value
    const totalResults = this.getTotalResults(searchInput)
    let currentPage = this.state.currentPage
    const totalNumberOfPages = this.getTotalNumberOfPages(totalResults, this.props.showCount)
    // If the user is searching, then make sure that the current page number does not go over the new totalNumberOfPages for this new totalResults set
    if(currentPage > totalNumberOfPages) currentPage = totalNumberOfPages
    const pagedResults = this.getPagedData(totalResults, currentPage)

    this.setState({ 
      searchInput,
      totalResults,
      pagedResults,
      totalNumberOfPages,
      currentPage
    })
  }

  goToPreviousPage() {
    const prevPageExists = (this.state.currentPage > 1)
    if(prevPageExists) {
      const updatedCurrentPage = this.state.currentPage - 1
      const pagedResults = this.getPagedData(this.state.totalResults, updatedCurrentPage)
      this.setState({ 
        currentPage: updatedCurrentPage,
        pagedResults
      })
    }
  }

  getTotalNumberOfPages(data, pageCapacity) {
    return Math.ceil(data.length / pageCapacity)
  }

  goToNextPage() {
    const nextPageExists = (this.state.currentPage < this.getTotalNumberOfPages(this.state.totalResults, this.props.showCount))
    if(nextPageExists) {
      const updatedCurrentPage = this.state.currentPage + 1
      const pagedResults = this.getPagedData(this.state.totalResults, updatedCurrentPage)
      this.setState({ 
        currentPage: updatedCurrentPage,
        pagedResults
      })
    }
  }

  render() {
    let searchResultsMarkup = this.resultsMarkup(this.state.pagedResults)
    if(searchResultsMarkup.length === 0) searchResultsMarkup = <span>No Projects found</span>

    return (
      <div>
        <div className="background-lighterBlue">
          <div className="row row--gutters column projects-search">
            <h2>Search our project database</h2>
            <label>
              <span className="sr-only">Search Projects</span>
              <span className="fa fa-search" aria-hidden="true"></span>
              <input type="text" placeholder="Search Projects" value={this.state.value} onChange={this.handleChange}/>
            </label>
          </div>
        </div>
        <div className="row row--gutters column projects-list">
          <div className="overflow-container">
            <ul>
              {searchResultsMarkup}
            </ul>
          </div>
          <div className="row">
            <PageSelector currentPage={this.state.currentPage} totalPages={this.getTotalNumberOfPages(this.state.totalResults, this.props.showCount)} onPrevious={this.goToPreviousPage} onNext={this.goToNextPage} />
          </div>
        </div>
      </div>
    )
  }
}

ProjectSearch.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  searchReferenceField: PropTypes.string,
  showCount: PropTypes.number
}

ProjectSearch.defaultProps = {
  searchReferenceField: ID_COLUMN_NAME,
  searchFields: SEARCH_FIELDS,
  showCount: 10
}
