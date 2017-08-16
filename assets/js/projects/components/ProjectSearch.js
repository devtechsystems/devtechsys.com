import React, { Component } from 'react'

export default class ProjectSearch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchInput: '',
      projects: props.projects,
      results: props.projects
    }
  }

  getResults() {

  }

  handleChange(event) {
    this.setState({ searchInput: event.target.value })
  }

  render() {
    return (
      <div>
        <div className="background-lighterBlue">
          <div className="row row--gutters column projects-search">
            <h2>Search our project database</h2>
            <label>
              <span className="sr-only">Search Projects</span>
              <span className="fa fa-search" aria-hidden="true"></span>
              <input type="text" placeholder="Search Projects" value={this.state.value} />
            </label>
          </div>
        </div>
        <div className="row row--gutters column projects-list">
          <div className="overflow-container">
            <ul>
              <li>
                <span className="project-country pull-right">Country</span>
                <span className="project-category">Practice Area/Category</span>
                <a href="#" className="project-title">Project Title</a>
              </li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
              <li><span className="project-country pull-right">Country</span><span className="project-category">Practice Area/Category</span><a href="#" className="project-title">Project Title</a></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
