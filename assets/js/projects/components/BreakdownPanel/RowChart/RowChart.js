import React, { Component } from 'react'
import PropTypes from 'prop-types'
import d3 from 'd3'
import DefaultRow from './DefaultRow.js'

export default class RowChart extends Component {
  rowHeight() {
    if (this.props.rowHeight) return this.props.rowHeight

    return this.props.height / this.props.data.length
  }

  svgHeight() {
    return this.rowHeight() * this.props.data.length
  }

  svgWidth() {
    const scrollbarWidth = 18
    if (this.svgHeight() >= this.props.height) return this.props.width - scrollbarWidth

    return this.props.width
  }

  xScale() {
    const maxValue = d3.max(this.props.data, d => d.value)
    return d3.scale.linear()
      .domain([0, maxValue])
      .range([0, this.props.width])
  }

  render() {
    const rowHeight = this.rowHeight()
    const rows = this.props.data.map((d, i) => {
      const y = rowHeight * i
      const Row = this.props.row
      return (
        <Row
          key={d.name}
          y={y}
          rowHeight={rowHeight}
          chartWidth={this.svgWidth()}
          datum={d}
          data={this.props.data}
          xScale={this.xScale()}
          color={this.props.colorMapper(d.value)}
          nameRenderer={this.props.nameRenderer}
          onRowClick={this.props.onRowClick}
        />
      )
    })

    const containerStyles = {
      width: this.props.width,
      height: this.props.height,
      overflow: 'auto'
    }
    return (
      <div className={`row-chart ${this.props.className || ''}`} style={containerStyles}>
        <svg width={this.svgWidth()} height={this.svgHeight()}>
          {rows}
        </svg>
      </div>
    )
  }
}

RowChart.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number
  })),
  row: PropTypes.func,
  rowHeight: PropTypes.number,
  colorMapper: PropTypes.func,
  nameRenderer: PropTypes.func,
  onRowClick: PropTypes.func
}

RowChart.defaultProps = {
  row: DefaultRow
}
