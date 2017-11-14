import ColorScale from '../util/ColorScale'

// Choropleth adapted from http://techslides.com/demos/d3/worldmap-template.html
// Zoom buttons adapted from http://bl.ocks.org/linssen/7352810
export default function(parentSelector) {
  const chart = {}

  d3.select(window).on("resize", throttle);

  var zoom = d3.behavior.zoom()
      .scaleExtent([1, 9])
      .on("zoom", zoomAndPan);

  var width = document.getElementById('projects-choropleth').offsetWidth;
  var parentHeight = document.getElementById('projects-choropleth').offsetHeight
  var height = width / 2;
  let center = [width/2, height / 2]

  var projection,path,svg,g;
  let _topojson, _data, _colorScale
  let _colorPalette = { colors: ['green', 'red', 'blue'], noDataColor: '#bbb' }
  let _colorMapper = (value) => '#ccc'
  let _valueAccessor = (datum) => (datum !== undefined) ? datum.value : undefined
  let _tooltipContent = (datum) => `${datum.name}<br/>${datum.value}`
  let _numberFormatter = (value) => Math.round(value)

  var tooltip = d3.select("#projects-choropleth").append("div").attr("class", "tooltip hidden");

  setup(width,height);

  function setup(width,height){
    projection = d3.geo.mercator()
      .translate([(width/2), (height/2)])
      .scale( width / 2 / Math.PI);

    path = d3.geo.path().projection(projection);

    svg = d3.select("#projects-choropleth").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .on("wheel.zoom", null) // Don't zoom with mouse scroll
        //.on("click", click)
        .append("g");

    g = svg.append("g")
          .on("click", click);
  }

  function setupColorMapper() {
    _colorScale = new ColorScale(_data, _colorPalette.colors, _colorPalette.noDataColor)
    _colorMapper = (value) => _colorScale.getColorFor(value)
  }

  function addLegend() {
    const legendBottomOffset = (height - parentHeight > 0) ? parentHeight - 200: height - 200
    const legend = svg.append('g')
      .classed('legend', true)
      .attr('transform', `translate(${20}, ${legendBottomOffset})`)
    legend.append('rect')
      .classed('background', true)
      .attr('width', 170)
      .attr('height', 180)
      .attr('fill', 'white')
    
    legend.append('text')
      .classed('legend-title', true)
      .text('Legend')
      .attr('alignment-baseline', 'hanging')
      .attr('y', 10)
      .attr('x', 10)
    
    const keyContainer = legend.append('g')
      .classed('key-container', true)
      .attr('transform', `translate(${10}, 35)`)
    
    const legendColors = _colorScale.scale.range().slice(0).reverse()
    legendColors.push(_colorScale.noDataColor)
    const keyRow = keyContainer.selectAll('g')
      .data(legendColors)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${0}, ${i * 20})`)

    keyRow.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', 15)
      .attr('width', 15)
      .attr('fill', (color) => color)
    
    keyRow.append('text')
      .text((color) => getLegendValueRange(color))
      .classed('key-text', true)
      .attr('alignment-baseline', 'hanging')
      .attr('x', 25)
      .attr('y', 0)
  }

  function getLegendValueRange(color) {
    const colorValueRange = _colorScale.scale.invertExtent
    if(!colorValueRange(color)[0]) return '0 Solutions'
    return `${_numberFormatter(Math.ceil(colorValueRange(color)[0]))} to ${_numberFormatter(Math.floor(colorValueRange(color)[1]))} Solutions`
  }

  chart.numberFormatter = function (_) {
    _numberFormatter = _
    return chart
  }

  chart.colorPalette = function(_) {
    _colorPalette = _
    if(_data !== undefined) setupColorMapper()
    return chart
  }

  chart.topojson = function (_) {
    _topojson = _
    return chart
  }

  chart.data = function (_) {
    _data = _
    return chart
  }

  chart.tooltipContent = function(_) {
    _tooltipContent = _
    return chart
  }

  function getDatum(key) {
    const datum = _data.find((d) => d.name === key)
    if(!datum) {
      const geoDatum = _topojson.find((d) => d.id === key)
      if(!geoDatum) {
        return{ noDataFound: true, noGeoDataFound: true, name: key }
      }
      return Object.assign({ noDataFound: true }, { geoData: geoDatum })
    }
    return Object.assign(datum, { geoData: _topojson.find((d) => d.id === key)})
  }

  function getDataValue(key) {
    return _valueAccessor(getDatum(key))
  }

  chart.draw = function () {
    setupColorMapper()
    addLegend()
    var country = g.selectAll(".country").data(_topojson);

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.properties.name; })
        .style("fill", function(d, i) { return _colorMapper(getDataValue(d.id)); });
    d3.selectAll(".country").style("stroke-width", .5 / zoom.scale());

    //offsets for tooltips
    var offsetL = document.getElementById('projects-choropleth').offsetLeft+20;
    var offsetT = document.getElementById('projects-choropleth').offsetTop+10;

    //tooltips
    country
      .on("mousemove", function(d,i) {

        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

        tooltip.classed("hidden", false)
              .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
              .html(_tooltipContent(getDatum(d.id)));

        })
        .on("mouseout",  function(d,i) {
          tooltip.classed("hidden", true);
        }); 

  }

  function redraw() {
    width = document.getElementById('projects-choropleth').offsetWidth;
    height = width / 2;
    d3.select('svg').remove();
    setup(width,height);
    chart.draw(_topojson);
  }

  function zoomAndPan(zoomFromButton) {
    if(!zoomFromButton) {
      var t = d3.event.translate;
      var s = d3.event.scale; 
      var h = height/4;

      t[0] = Math.min(
        (width/height)  * (s - 1), 
        Math.max( width * (1 - s), t[0] )
      );

      t[1] = Math.min(
        h * (s - 1) + h * s, 
        Math.max(height  * (1 - s) - h * s, t[1])
      );

      zoom.translate(t);
      g.attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    
    g.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
    //adjust the country hover stroke width based on zoom level
    d3.selectAll(".country").style("stroke-width", .5 / zoom.scale());

  }

  var throttleTimer;
  function throttle() {
    window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
        redraw();
      }, 200);
  }

  //geo translation on mouse click in map
  function click() {
    var latlon = projection.invert(d3.mouse(this));
  }

  //function to add points and text to the map (used in plotting capitals)
  function addpoint(lon,lat,text) {

    var gpoint = g.append("g").attr("class", "gpoint");
    var x = projection([lon,lat])[0];
    var y = projection([lon,lat])[1];

    gpoint.append("svg:circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("class","point")
          .attr("r", 1.5);

    //conditional in case a point has no associated text
    if(text.length>0){

      gpoint.append("text")
            .attr("x", x+2)
            .attr("y", y+2)
            .attr("class","text")
            .text(text);
    }

  }

  // ZOOM BUTTON LOGIC ***********
  function interpolateZoom (translate, scale) {
      var self = this;
      return d3.transition().duration(350).tween("zoom", function () {
          var iTranslate = d3.interpolate(zoom.translate(), translate),
              iScale = d3.interpolate(zoom.scale(), scale);
          return function (t) {
              zoom
                  .scale(iScale(t))
                  .translate(iTranslate(t));
              zoomAndPan(true);
          };
      });
  }

  function zoomClick() {
      var clicked = d3.event.target,
          direction = 1,
          factor = 0.2,
          target_zoom = 1,
          center = [width / 2, height / 2],
          extent = zoom.scaleExtent(),
          translate = zoom.translate(),
          translate0 = [],
          l = [],
          view = {x: translate[0], y: translate[1], k: zoom.scale()};

      d3.event.preventDefault();
      direction = (this.id === 'zoom-in') ? 1 : -1;
      target_zoom = zoom.scale() * (1 + factor * direction);

      if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

      translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
      view.k = target_zoom;
      l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

      view.x += center[0] - l[0];
      view.y += center[1] - l[1];

      interpolateZoom([view.x, view.y], view.k);
  }

  function resetZoom() {
    interpolateZoom([0, 0], 1)
  }

  d3.selectAll('#projects-choropleth .zoom-button').on('click', zoomClick)
  d3.select('#projects-choropleth .reset-button').on('click', resetZoom)
  return chart
}
