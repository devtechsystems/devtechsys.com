import React, { Component } from 'react'
import PropTypes from 'prop-types'
import d3 from 'd3'
import qdformatters from 'qd-formatters'
import classNames from 'classnames'

const formatters = qdformatters(d3)

export default class RadRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showEllipses: false
    }
  }

  componentDidMount() {
    const textWidth = this.nameTextElement.getBoundingClientRect().width
    if (textWidth > this.availableWidthForName() && !this.state.showEllipses) {
      this.setState({ showEllipses: true })
    }
  }

  componentDidUpdate() {
    const textWidth = this.nameTextElement.getBoundingClientRect().width
    if (textWidth > this.availableWidthForName() && !this.state.showEllipses) {
      this.setState({ showEllipses: true })
    } else if (textWidth < this.availableWidthForName() && this.state.showEllipses) {
      this.setState({ showEllipses: false })
    }
  }

  availableWidthForName() {
    return this.props.chartWidth - 53
  }

  render() {
    const { y, rowHeight, chartWidth, datum, data, xScale } = this.props
    let barWidth
    const textValueClassNames = classNames('rad-row-value-text', { 'rad-row-negative': (datum.value < 0) })
    if (datum.value < 0) {
      barWidth = 0
    } else {
      barWidth = xScale(datum.value)
    }
    const barHeight = rowHeight * 0.35
    const fontSize = barHeight * 0.9
    const textY = y + fontSize
    const barY = y + barHeight
    const availableWidthForName = chartWidth - 53
    const ellipses = (this.state.showEllipses) ?
      (
        <text
          className={'rad-row-name-ellipses'}
          x={availableWidthForName}
          y={textY}
          fontSize={fontSize}
        >
          <title>{datum.name}</title>
          ...
        </text>
      ) :
      ''

    return (
      <g className="rad-row">
        <text
          ref={(textElement) => { this.nameTextElement = textElement }}
          className="rad-row-name-text"
          y={textY}
          fontSize={fontSize}
        >
          <title>{datum.name}</title>
          {datum.name}
        </text>
        <rect
          className="rad-row-value-background"
          x={chartWidth - 54}
          y={y}
          width={54}
          height={rowHeight - barHeight}
        />
        {ellipses}
        <text
          className={textValueClassNames}
          x={chartWidth}
          y={textY}
          fontSize={fontSize}
          textAnchor="end"
        >
          ${formatters.bigNumberFormat(datum.value)}
        </text>
        <rect
          className="rad-row-background"
          y={barY}
          width={chartWidth}
          height={barHeight}
        />
        <rect
          className="rad-row-bar"
          y={barY}
          width={barWidth}
          height={barHeight}
        />
      </g>
    )
  }
}

RadRow.propTypes = {
  y: PropTypes.number,
  chartWidth: PropTypes.number,
  rowHeight: PropTypes.number,
  datum: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number
  }),
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number
  })),
  xScale: PropTypes.func
}
