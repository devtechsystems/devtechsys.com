import React, { Component } from 'react'
import PropTypes from 'prop-types'
import d3 from 'd3'
import classNames from 'classnames'

const defaultNameRenderer = (name, x, y, fontSize, refFunc, onRowClick) => (
  <text
    ref={refFunc}
    className="rad-row-name-text"
    x={x}
    y={y}
    fontSize={fontSize}
    alignmentBaseline="hanging"
    onClick={() => {onRowClick(name)}}
  >
    <title>{name}</title>
    {name}
  </text>
)

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
    return (this.props.chartWidth - 53) - this.widthForCircle()
  }

  widthForCircle() {
    return (this.getCircleRadius() * 2) + this.props.circlePaddingRight
  }

  heightForText() {
    return this.props.rowHeight / 3
  }

  getCircleRadius() {
    return this.heightForText() / 2
  }

  render() {
    const { y, rowHeight, chartWidth, datum, data, xScale, nameRenderer, onRowClick } = this.props
    let barWidth
    const textValueClassNames = classNames('rad-row-value-text', { 'rad-row-negative': (datum.value < 0) })
    if (datum.value < 0) {
      barWidth = 0
    } else {
      barWidth = xScale(datum.value)
    }
    const barHeight = rowHeight / 6
    const fontSize = this.heightForText()
    const circleRadius = this.getCircleRadius()
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
          cy={y + circleRadius}
          r={circleRadius}
          fill={this.props.color}
        />
        {nameRenderer(datum.name, this.widthForCircle(), y, fontSize, (textElement) => { this.nameTextElement = textElement }, onRowClick)}
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
          fill={this.props.color}
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
  xScale: PropTypes.func,
  color: PropTypes.string,
  nameRenderer: PropTypes.func,
  onRowClick: PropTypes.func
}

RadRow.defaultProps = {
  circlePaddingRight: 8,
  spaceForValueText: 54,
  nameRenderer: defaultNameRenderer,
  onRowClick: () => {console.log('row clicked')}
}
