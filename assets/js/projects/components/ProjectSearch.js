import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Lunr from 'lunr'
import { PracticeAreaTitle } from '../util/Humanify'
import { SEARCH_FIELDS } from './SearchFields'
import { COUNTRY_COLUMN_NAME, PRACTICE_AREA_COLUMN_NAMES, PROJECT_TITLE_COLUMN_NAME, ID_COLUMN_NAME } from '../ColumnNames'

export default class ProjectSearch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchInput: '',
      projects: props.projects,
      results: props.projects
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
    this.getResults = this.getResults.bind(this)
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

  getResults(searchInput) {
    const resultsRefs = this.searchIndex.search(`*${searchInput}*`).map((result) => result.ref)
    const resultsRecords = resultsRefs.map((ref) => {
      return this.props.projects.find((project) => project[this.props.searchReferenceField] === ref)
    })
    const resultsMarkup = resultsRecords.map((record) => {
      return (
        <li key={record[ID_COLUMN_NAME]}><span className="project-country pull-right">{record[COUNTRY_COLUMN_NAME]}</span><span className="project-category">{this.getPracticeAreasMarkup(record)}</span><a href="#" className="project-title">{record[PROJECT_TITLE_COLUMN_NAME]}</a></li>
      )
    })
    return resultsMarkup
  }

  handleChange(event) {
    this.setState({ searchInput: event.target.value })
  }

  render() {
    let searchResults = this.getResults(this.state.searchInput)
    if(searchResults.length === 0) searchResults = <span>No Projects found</span>

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
              {searchResults}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

ProjectSearch.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  searchReferenceField: PropTypes.string
}

ProjectSearch.defaultProps = {
  searchReferenceField: ID_COLUMN_NAME,
  searchFields: SEARCH_FIELDS
}
