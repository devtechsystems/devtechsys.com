import d3 from 'd3'

export default class ColorScale {
  constructor(data, colors, noDataColor = "#ddd", valueAccessorFunc = (d) => d.value, scaleType = 'quantize', customDomain) {
    this.data = data
    this.colors = colors
    this.noDataColor = noDataColor
    this.valueAccessorFunc = valueAccessorFunc
    this.scaleType = scaleType
    this.customDomain = customDomain

    // Setup the scale based on scale type
    if(scaleType === 'quantize') { // Calculate the colors based on a linear quantize domain
      this.scale = d3.scale.quantize()
    }
    else if(scaleType === "quantile") { // Calculate the colors by n domain sections(similar to quartiles but of n sections)
      this.scale = d3.scale.quantile()
    }
    this.scale.domain(this.calculateDomain())
      .range(colors)
  }

  calculateDomain() {
    if(this.customDomain) {
      return this.customDomain
    }
    else if(this.scaleType === 'quantize') {
      // Standard min/max domain for linear quantize scale
      return [d3.min(this.data, this.valueAccessorFunc), d3.max(this.data, this.valueAccessorFunc)]
    }
    else if(this.scaleType === 'quantile') {
      // If the user didn't specify a list of quantiles using the customDomain
      // then use the data itself as the quantiles
      return this.data.map(this.valueAccessorFunc)
    }
    
  }

  setDomain() {
    this.scale.domain(this.calculateDomain())
  }

  setData(data) {
    this.data = data
  }

  getColorFor(value) {
    if(value === undefined) {
      return this.noDataColor
    }
    return this.scale(value)
  }
}
