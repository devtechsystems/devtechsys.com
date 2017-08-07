import React, { Component } from 'react'
import PropTypes from 'prop-types'
import d3 from 'd3'
import classNames from 'classnames'

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
    return (this.props.chartWidth - 53) - this.spaceForCircle()
  }

  spaceForCircle() {
    return (this.getCircleRadius() * 2) + this.props.circlePaddingRight
  }

  getFontSize() {
    return this.props.rowHeight / 3
  }

  getCircleRadius() {
    return this.getFontSize() / 2
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
    const barHeight = rowHeight / 6
    const fontSize = this.getFontSize()
    const circleRadius = this.getCircleRadius()
    const circleTopAdjustment = 1 // Move the circle slightly down to be flush with text
    const barY = y + (rowHeight / 3) + (rowHeight / 6)
    const ellipsesXAdjustment = 2 // Move ellipsis slightly right so it has padding
    const ellipses = (this.state.showEllipses) ?
      (
        <text
          className={'rad-row-name-ellipses'}
          x={chartWidth - this.props.spaceForValueText + ellipsesXAdjustment}
          y={y}
          fontSize={fontSize}
          alignmentBaseline="hanging"
        >
          <title>{datum.name}</title>
          ...
        </text>
      ) :
      ''

    return (
      <g className="rad-row">
        <circle
          cx={0 + circleRadius}
          cy={y + circleRadius + circleTopAdjustment}
          r={circleRadius}
        />
        <text
          ref={(textElement) => { this.nameTextElement = textElement }}
          className="rad-row-name-text"
          x={this.spaceForCircle()}
          y={y}
          fontSize={fontSize}
          alignmentBaseline="hanging"
        >
          <title>{datum.name}</title>
          {datum.name}
        </text>
        <rect
          className="rad-row-value-background"
          x={chartWidth - this.props.spaceForValueText}
          y={y}
          width={this.props.spaceForValueText}
          height={rowHeight - barHeight}
        />
        {ellipses}
        <text
          className={textValueClassNames}
          x={chartWidth}
          y={y}
          fontSize={fontSize}
          textAnchor="end"
          alignmentBaseline="hanging"
        >
          {datum.value}
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

RadRow.defaultProps = {
  circlePaddingRight: 8,
  spaceForValueText: 54
}
