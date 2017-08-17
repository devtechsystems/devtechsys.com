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
      totalNumberOfPages: 0,
      sortBy: { columnName: 'Project Title', order: 'asc' }
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
    this.setSort = this.setSort.bind(this)
  }

  componentWillMount() {
    const totalResults = this.getTotalResults(this.state.searchInput, this.state.sortBy)
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

  // Note this function is for sorting strings
  generateSortFunc(sortColumn, sortOrder) {
    if(sortOrder == 'asc') {
      return function(a, b) {
        return a[sortColumn].localeCompare(b[sortColumn])
      }
    } else {
      return function(a, b) {
        return b[sortColumn].localeCompare(a[sortColumn])
      }
    }
  }

  getTotalResults(searchInput, sortBy) {
    const resultsRefs = this.searchIndex.search(`*${searchInput}*`).map((result) => result.ref)
    const resultsRecords = resultsRefs.map((ref) => {
      return this.props.projects.find((project) => project[this.props.searchReferenceField] === ref)
    })
    .sort(this.generateSortFunc(sortBy.columnName, sortBy.order))
    return resultsRecords
  }

  resultsMarkup(resultsRecords) {
    const resultsMarkup = resultsRecords.map((record) => {
      // return (
      //   <li key={record[ID_COLUMN_NAME]}><span className="project-country pull-right">{record[COUNTRY_COLUMN_NAME]}</span><span className="project-category">{this.getPracticeAreasMarkup(record)}</span><a href="#" className="project-title">{record[PROJECT_TITLE_COLUMN_NAME]}</a></li>
      // )
      return (
        <li key={record[ID_COLUMN_NAME]}>
          <div className="column small-16">
            <div className="row">
              <div className="column">
                <div className="project-category">{this.getPracticeAreasMarkup(record)}</div>
              </div>
            </div>
            <div className="row">
              <div className="column small-8 medium-10">
                <a href="#" className="project-title">{record[PROJECT_TITLE_COLUMN_NAME]}</a>
              </div>
              <div className="column small-8 medium-6">
                {record[COUNTRY_COLUMN_NAME]}
              </div>
            </div>
          </div>
        </li>
      )
    })
    return resultsMarkup
  }

  handleChange(event) {
    const searchInput = event.target.value
    const totalResults = this.getTotalResults(searchInput, this.state.sortBy)
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

  setSort(sortColumn) {
    if(this.state.sortBy.order === 'asc') {
      const sortBy = { columnName: sortColumn, order: 'desc' }
      const totalResults = this.getTotalResults(this.state.searchInput, sortBy)
      const pagedResults = this.getPagedData(totalResults, this.state.currentPage)
      this.setState({
        sortBy,
        totalResults,
        pagedResults
      })
    } else if(this.state.sortBy.order === 'desc') {
      const sortBy = { columnName: sortColumn, order: 'asc' }
      const totalResults = this.getTotalResults(this.state.searchInput, sortBy)
      const pagedResults = this.getPagedData(totalResults, this.state.currentPage)
      this.setState({
        sortBy,
        totalResults,
        pagedResults
      })
    }
  }

  getSortArrow(columnName) {
    const sortBy = this.state.sortBy
    if(sortBy.columnName !== columnName) {
      return ''
    } else {
      if(sortBy.order === 'asc') {
        return <span className="sort-caret fa fa-caret-up"></span>
      } else if(sortBy.order === 'desc') {
        return <span className="sort-caret fa fa-caret-down"></span>
      }
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
          <div className="column background-lighterBlue project-results-header">
            <div className="row">
              <div className="column small-8 medium-10"><a onClick={() => this.setSort('Project Title')}>Project{this.getSortArrow('Project Title')}</a></div>
              <div className="column small-8 medium-6"><a onClick={() => this.setSort('Country')}>Country{this.getSortArrow('Country')}</a></div>
            </div>
          </div>
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
