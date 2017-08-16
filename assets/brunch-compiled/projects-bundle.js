(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("assets/js/projects/ColumnNames.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var PRACTICE_AREAS = {
  ECONOMIC_ANALYSIS: "M&E Practice Area",
  EDUCATION_AND_YOUTH_DEVELOPMENT: "Education and Youth Development Practice Area",
  GENDER_AND_INCLUSIVE_DEVELOPMENT: "Gender and Inclusive Development Practice Area",
  PFM_AND_INSTITUTION_BUILDING: "Public Financial and Fiscal Sustainability Practice Area"
};

exports.PRACTICE_AREAS = PRACTICE_AREAS;

});

require.register("assets/js/projects/components/BreakdownPanel/RowChart/DefaultRow.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RadRow = function (_Component) {
  _inherits(RadRow, _Component);

  function RadRow(props) {
    _classCallCheck(this, RadRow);

    var _this = _possibleConstructorReturn(this, (RadRow.__proto__ || Object.getPrototypeOf(RadRow)).call(this, props));

    _this.state = {
      showEllipses: false
    };
    return _this;
  }

  _createClass(RadRow, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var textWidth = this.nameTextElement.getBoundingClientRect().width;
      if (textWidth > this.availableWidthForName() && !this.state.showEllipses) {
        this.setState({ showEllipses: true });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var textWidth = this.nameTextElement.getBoundingClientRect().width;
      if (textWidth > this.availableWidthForName() && !this.state.showEllipses) {
        this.setState({ showEllipses: true });
      } else if (textWidth < this.availableWidthForName() && this.state.showEllipses) {
        this.setState({ showEllipses: false });
      }
    }
  }, {
    key: 'availableWidthForName',
    value: function availableWidthForName() {
      return this.props.chartWidth - 53 - this.widthForCircle();
    }
  }, {
    key: 'widthForCircle',
    value: function widthForCircle() {
      return this.getCircleRadius() * 2 + this.props.circlePaddingRight;
    }
  }, {
    key: 'heightForText',
    value: function heightForText() {
      return this.props.rowHeight / 3;
    }
  }, {
    key: 'getCircleRadius',
    value: function getCircleRadius() {
      return this.heightForText() / 2;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          y = _props.y,
          rowHeight = _props.rowHeight,
          chartWidth = _props.chartWidth,
          datum = _props.datum,
          data = _props.data,
          xScale = _props.xScale;

      var barWidth = void 0;
      var textValueClassNames = (0, _classnames2.default)('rad-row-value-text', { 'rad-row-negative': datum.value < 0 });
      if (datum.value < 0) {
        barWidth = 0;
      } else {
        barWidth = xScale(datum.value);
      }
      var barHeight = rowHeight / 6;
      var fontSize = this.heightForText();
      var circleRadius = this.getCircleRadius();
      var barY = y + rowHeight / 3 + rowHeight / 6;
      var ellipsesXAdjustment = 2; // Move ellipsis slightly right so it has padding
      var ellipses = this.state.showEllipses ? _react2.default.createElement(
        'text',
        {
          className: 'rad-row-name-ellipses',
          x: chartWidth - this.props.spaceForValueText + ellipsesXAdjustment,
          y: y,
          fontSize: fontSize,
          alignmentBaseline: 'hanging'
        },
        _react2.default.createElement(
          'title',
          null,
          datum.name
        ),
        '...'
      ) : '';

      return _react2.default.createElement(
        'g',
        { className: 'rad-row' },
        _react2.default.createElement('circle', {
          cx: 0 + circleRadius,
          cy: y + circleRadius,
          r: circleRadius,
          fill: this.props.color
        }),
        _react2.default.createElement(
          'text',
          {
            ref: function ref(textElement) {
              _this2.nameTextElement = textElement;
            },
            className: 'rad-row-name-text',
            x: this.widthForCircle(),
            y: y,
            fontSize: fontSize,
            alignmentBaseline: 'hanging'
          },
          _react2.default.createElement(
            'title',
            null,
            datum.name
          ),
          datum.name
        ),
        _react2.default.createElement('rect', {
          className: 'rad-row-value-background',
          x: chartWidth - this.props.spaceForValueText,
          y: y,
          width: this.props.spaceForValueText,
          height: rowHeight - barHeight
        }),
        ellipses,
        _react2.default.createElement(
          'text',
          {
            className: textValueClassNames,
            x: chartWidth,
            y: y,
            fontSize: fontSize,
            textAnchor: 'end',
            alignmentBaseline: 'hanging'
          },
          datum.value
        ),
        _react2.default.createElement('rect', {
          className: 'rad-row-background',
          y: barY,
          width: chartWidth,
          height: barHeight
        }),
        _react2.default.createElement('rect', {
          className: 'rad-row-bar',
          y: barY,
          width: barWidth,
          height: barHeight,
          fill: this.props.color
        })
      );
    }
  }]);

  return RadRow;
}(_react.Component);

exports.default = RadRow;


RadRow.propTypes = {
  y: _propTypes2.default.number,
  chartWidth: _propTypes2.default.number,
  rowHeight: _propTypes2.default.number,
  datum: _propTypes2.default.shape({
    name: _propTypes2.default.string,
    value: _propTypes2.default.number
  }),
  data: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string,
    value: _propTypes2.default.number
  })),
  xScale: _propTypes2.default.func,
  color: _propTypes2.default.string
};

RadRow.defaultProps = {
  circlePaddingRight: 8,
  spaceForValueText: 54
};

});

require.register("assets/js/projects/components/BreakdownPanel/RowChart/RowChart.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _DefaultRow = require('./DefaultRow.js');

var _DefaultRow2 = _interopRequireDefault(_DefaultRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RowChart = function (_Component) {
  _inherits(RowChart, _Component);

  function RowChart() {
    _classCallCheck(this, RowChart);

    return _possibleConstructorReturn(this, (RowChart.__proto__ || Object.getPrototypeOf(RowChart)).apply(this, arguments));
  }

  _createClass(RowChart, [{
    key: 'rowHeight',
    value: function rowHeight() {
      if (this.props.rowHeight) return this.props.rowHeight;

      return this.props.height / this.props.data.length;
    }
  }, {
    key: 'svgHeight',
    value: function svgHeight() {
      return this.rowHeight() * this.props.data.length;
    }
  }, {
    key: 'svgWidth',
    value: function svgWidth() {
      var scrollbarWidth = 18;
      if (this.svgHeight() >= this.props.height) return this.props.width - scrollbarWidth;

      return this.props.width;
    }
  }, {
    key: 'xScale',
    value: function xScale() {
      var maxValue = _d2.default.max(this.props.data, function (d) {
        return d.value;
      });
      return _d2.default.scale.linear().domain([0, maxValue]).range([0, this.props.width]);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var rowHeight = this.rowHeight();
      var rows = this.props.data.map(function (d, i) {
        var y = rowHeight * i;
        var Row = _this2.props.row;
        return _react2.default.createElement(Row, {
          key: d.name,
          y: y,
          rowHeight: rowHeight,
          chartWidth: _this2.svgWidth(),
          datum: d,
          data: _this2.props.data,
          xScale: _this2.xScale(),
          color: _this2.props.colorMapper(d.value)
        });
      });

      var containerStyles = {
        width: this.props.width,
        height: this.props.height,
        overflow: 'auto'
      };
      return _react2.default.createElement(
        'div',
        { className: 'row-chart ' + (this.props.className || ''), style: containerStyles },
        _react2.default.createElement(
          'svg',
          { width: this.svgWidth(), height: this.svgHeight() },
          rows
        )
      );
    }
  }]);

  return RowChart;
}(_react.Component);

exports.default = RowChart;


RowChart.propTypes = {
  className: _propTypes2.default.string,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  data: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string,
    value: _propTypes2.default.number
  })),
  row: _propTypes2.default.func,
  rowHeight: _propTypes2.default.number,
  colorMapper: _propTypes2.default.func
};

RowChart.defaultProps = {
  row: _DefaultRow2.default
};

});

require.register("assets/js/projects/components/BreakdownPanel/RowChart/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RowChart = require('./RowChart');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RowChart).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

;require.register("assets/js/projects/components/BreakdownPanel/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref2) {
  var data = _ref2.data,
      colorPalette = _ref2.colorPalette,
      title = _ref2.title,
      groupTitle = _ref2.groupTitle;

  var colorScale = new _ColorScale2.default(data, colorPalette.colors, colorPalette.noDataColor);
  var totalValue = data.reduce(function (accumulated, next) {
    return accumulated += next.value;
  }, 0);

  return _react2.default.createElement(
    'div',
    { className: 'breakdown-panel row' },
    _react2.default.createElement(
      'div',
      { className: 'left-column column small-4' },
      _react2.default.createElement(_reactCountup2.default, { className: 'number-countup', start: 0, end: totalValue, duration: 3 }),
      _react2.default.createElement(
        'div',
        { className: 'breakdown-title' },
        title
      ),
      _react2.default.createElement(
        _recharts.PieChart,
        { width: 100, height: 100 },
        _react2.default.createElement(_recharts.Tooltip, { content: _react2.default.createElement(TooltipContent, null) }),
        _react2.default.createElement(
          _recharts.Pie,
          {
            dataKey: 'value',
            data: data,
            innerRadius: 20,
            outerRadius: 50,
            cx: '50%',
            cy: '50%',
            startAngle: 90,
            endAngle: -270
          },
          data.map(function (element, index) {
            return _react2.default.createElement(_recharts.Cell, { key: element.name, fill: colorScale.getColorFor(data[index].value) });
          })
        )
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'right-column column small-8' },
      _react2.default.createElement(
        'div',
        { className: 'breakdown-group-title' },
        'By ',
        groupTitle
      ),
      _react2.default.createElement(_RowChart2.default, {
        rowHeight: 40,
        width: 200,
        height: 300,
        data: data,
        colorMapper: function colorMapper(value) {
          return colorScale.getColorFor(value);
        }
      })
    )
  );
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RowChart = require('./RowChart');

var _RowChart2 = _interopRequireDefault(_RowChart);

var _ColorScale = require('../../util/ColorScale.js');

var _ColorScale2 = _interopRequireDefault(_ColorScale);

var _reactCountup = require('react-countup');

var _reactCountup2 = _interopRequireDefault(_reactCountup);

var _recharts = require('recharts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TooltipContent = function TooltipContent(_ref) {
  var active = _ref.active,
      type = _ref.type,
      payload = _ref.payload,
      label = _ref.label;

  if (!active) return null;
  var hoverData = payload[0].payload;
  return _react2.default.createElement(
    'div',
    { className: 'tt-content', style: { width: 200, height: 'auto' } },
    _react2.default.createElement(
      'div',
      { className: 'tt-label' },
      hoverData.name
    ),
    hoverData.value
  );
};

});

require.register("assets/js/projects/components/D3Choropleth.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (parentSelector) {
  var chart = {};

  d3.select(window).on("resize", throttle);

  var zoom = d3.behavior.zoom().scaleExtent([1, 9]).on("zoom", zoomAndPan);

  var width = document.getElementById('projects-choropleth').offsetWidth;
  var height = width / 2;
  var center = [width / 2, height / 2];

  var projection, path, svg, g;
  var _topojson = void 0,
      _data = void 0,
      _colorScale = void 0;
  var _colorPalette = { colors: ['green', 'red', 'blue'], noDataColor: '#bbb' };
  var _colorMapper = function _colorMapper(value) {
    return '#ccc';
  };
  var _valueAccessor = function _valueAccessor(datum) {
    return datum !== undefined ? datum.value : undefined;
  };
  var _tooltipContent = function _tooltipContent(datum) {
    return datum.name + "<br/>" + datum.value;
  };
  var _numberFormatter = function _numberFormatter(value) {
    return Math.round(value);
  };

  var tooltip = d3.select("#projects-choropleth").append("div").attr("class", "tooltip hidden");

  setup(width, height);

  function setup(width, height) {
    projection = d3.geo.mercator().translate([width / 2, height / 2]).scale(width / 2 / Math.PI);

    path = d3.geo.path().projection(projection);

    svg = d3.select("#projects-choropleth").append("svg").attr("width", width).attr("height", height).call(zoom).on("wheel.zoom", null) // Don't zoom with mouse scroll
    //.on("click", click)
    .append("g");

    g = svg.append("g").on("click", click);
  }

  function setupColorMapper() {
    _colorScale = new _ColorScale2.default(_data, _colorPalette.colors, _colorPalette.noDataColor);
    _colorMapper = function _colorMapper(value) {
      return _colorScale.getColorFor(value);
    };
  }

  function addLegend() {
    var legend = svg.append('g').classed('legend', true).attr('transform', "translate(" + 30 + ", " + (height - 420) + ")");
    legend.append('rect').classed('background', true).attr('width', 170).attr('height', 180).attr('fill', 'white');

    legend.append('text').classed('legend-title', true).text('Legend').attr('alignment-baseline', 'hanging').attr('y', 10).attr('x', 10);

    var keyContainer = legend.append('g').classed('key-container', true).attr('transform', "translate(" + 10 + ", 35)");

    var legendColors = _colorScale.scale.range().slice(0).reverse();
    legendColors.push(_colorScale.noDataColor);
    var keyRow = keyContainer.selectAll('g').data(legendColors).enter().append('g').attr('transform', function (d, i) {
      return "translate(" + 0 + ", " + i * 20 + ")";
    });

    keyRow.append('rect').attr('x', 0).attr('y', 0).attr('height', 15).attr('width', 15).attr('fill', function (color) {
      return color;
    });

    keyRow.append('text').text(function (color) {
      return getLegendValueRange(color);
    }).classed('key-text', true).attr('alignment-baseline', 'hanging').attr('x', 25).attr('y', 0);
  }

  function getLegendValueRange(color) {
    var colorValueRange = _colorScale.scale.invertExtent;
    if (!colorValueRange(color)[0]) return '0 Projects';
    return _numberFormatter(colorValueRange(color)[0]) + " to " + _numberFormatter(colorValueRange(color)[1]) + " Projects";
  }

  chart.numberFormatter = function (_) {
    _numberFormatter = _;
    return chart;
  };

  chart.colorPalette = function (_) {
    _colorPalette = _;
    if (_data !== undefined) setupColorMapper();
    return chart;
  };

  chart.topojson = function (_) {
    _topojson = _;
    return chart;
  };

  chart.data = function (_) {
    _data = _;
    return chart;
  };

  chart.tooltipContent = function (_) {
    _tooltipContent = _;
    return chart;
  };

  function getDatum(key) {
    return _data.find(function (d) {
      return d.name === key;
    }) || { name: undefined, value: undefined };
  }

  function getDataValue(key) {
    return _valueAccessor(getDatum(key));
  }

  chart.draw = function () {
    setupColorMapper();
    addLegend();
    var country = g.selectAll(".country").data(_topojson);

    country.enter().insert("path").attr("class", "country").attr("d", path).attr("id", function (d, i) {
      return d.id;
    }).attr("title", function (d, i) {
      return d.properties.name;
    }).style("fill", function (d, i) {
      return _colorMapper(getDataValue(d.properties.name));
    });
    d3.selectAll(".country").style("stroke-width", .5 / zoom.scale());

    //offsets for tooltips
    var offsetL = document.getElementById('projects-choropleth').offsetLeft + 20;
    var offsetT = document.getElementById('projects-choropleth').offsetTop + 10;

    //tooltips
    country.on("mousemove", function (d, i) {

      var mouse = d3.mouse(svg.node()).map(function (d) {
        return parseInt(d);
      });

      tooltip.classed("hidden", false).attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px").html(_tooltipContent(getDatum(d.properties.name)));
    }).on("mouseout", function (d, i) {
      tooltip.classed("hidden", true);
    });
  };

  function redraw() {
    width = document.getElementById('projects-choropleth').offsetWidth;
    height = width / 2;
    d3.select('svg').remove();
    setup(width, height);
    chart.draw(_topojson);
  }

  function zoomAndPan(zoomFromButton) {
    if (!zoomFromButton) {
      var t = d3.event.translate;
      var s = d3.event.scale;
      var h = height / 4;

      t[0] = Math.min(width / height * (s - 1), Math.max(width * (1 - s), t[0]));

      t[1] = Math.min(h * (s - 1) + h * s, Math.max(height * (1 - s) - h * s, t[1]));

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
    throttleTimer = window.setTimeout(function () {
      redraw();
    }, 200);
  }

  //geo translation on mouse click in map
  function click() {
    var latlon = projection.invert(d3.mouse(this));
  }

  //function to add points and text to the map (used in plotting capitals)
  function addpoint(lon, lat, text) {

    var gpoint = g.append("g").attr("class", "gpoint");
    var x = projection([lon, lat])[0];
    var y = projection([lon, lat])[1];

    gpoint.append("svg:circle").attr("cx", x).attr("cy", y).attr("class", "point").attr("r", 1.5);

    //conditional in case a point has no associated text
    if (text.length > 0) {

      gpoint.append("text").attr("x", x + 2).attr("y", y + 2).attr("class", "text").text(text);
    }
  }

  // ZOOM BUTTON LOGIC ***********
  function interpolateZoom(translate, scale) {
    var self = this;
    return d3.transition().duration(350).tween("zoom", function () {
      var iTranslate = d3.interpolate(zoom.translate(), translate),
          iScale = d3.interpolate(zoom.scale(), scale);
      return function (t) {
        zoom.scale(iScale(t)).translate(iTranslate(t));
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
        view = { x: translate[0], y: translate[1], k: zoom.scale() };

    d3.event.preventDefault();
    direction = this.id === 'zoom-in' ? 1 : -1;
    target_zoom = zoom.scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) {
      return false;
    }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);
  }

  function resetZoom() {
    interpolateZoom([0, 0], 1);
  }

  d3.selectAll('#projects-choropleth .zoom-button').on('click', zoomClick);
  d3.select('#projects-choropleth .reset-button').on('click', resetZoom);
  return chart;
};

var _ColorScale = require("../util/ColorScale");

var _ColorScale2 = _interopRequireDefault(_ColorScale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

;require.register("assets/js/projects/components/ProjectSearch.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectSearch = function (_Component) {
  _inherits(ProjectSearch, _Component);

  function ProjectSearch(props) {
    _classCallCheck(this, ProjectSearch);

    var _this = _possibleConstructorReturn(this, (ProjectSearch.__proto__ || Object.getPrototypeOf(ProjectSearch)).call(this, props));

    _this.state = {
      searchInput: '',
      projects: props.projects,
      results: props.projects
    };
    return _this;
  }

  _createClass(ProjectSearch, [{
    key: 'getResults',
    value: function getResults() {}
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({ searchInput: event.target.value });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'background-lighterBlue' },
          _react2.default.createElement(
            'div',
            { className: 'row row--gutters column projects-search' },
            _react2.default.createElement(
              'h2',
              null,
              'Search our project database'
            ),
            _react2.default.createElement(
              'label',
              null,
              _react2.default.createElement(
                'span',
                { className: 'sr-only' },
                'Search Projects'
              ),
              _react2.default.createElement('span', { className: 'fa fa-search', 'aria-hidden': 'true' }),
              _react2.default.createElement('input', { type: 'text', placeholder: 'Search Projects', value: this.state.value })
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'row row--gutters column projects-list' },
          _react2.default.createElement(
            'div',
            { className: 'overflow-container' },
            _react2.default.createElement(
              'ul',
              null,
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'project-country pull-right' },
                  'Country'
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'project-category' },
                  'Practice Area/Category'
                ),
                _react2.default.createElement(
                  'a',
                  { href: '#', className: 'project-title' },
                  'Project Title'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return ProjectSearch;
}(_react.Component);

exports.default = ProjectSearch;

});

require.register("assets/js/projects/components/StackedBarChart.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (_ref2) {
  var data = _ref2.data,
      xAxisDataKey = _ref2.xAxisDataKey,
      stackDataKey = _ref2.stackDataKey,
      colorPalette = _ref2.colorPalette,
      _ref2$valueKey = _ref2.valueKey,
      valueKey = _ref2$valueKey === undefined ? 'value' : _ref2$valueKey;

  var colorsDarkToLight = colorPalette.colors.slice(0).reverse(); // Clone then reverse
  var xGrouping = _lodash2.default.groupBy(data, xAxisDataKey);
  var xGroupingWithSums = _lodash2.default.mapValues(xGrouping, function (collectionForXGroup) {
    var stackGrouping = _lodash2.default.groupBy(collectionForXGroup, stackDataKey);
    var stackGroupingWithSums = (0, _Reduce.reduceSum)(stackGrouping, valueKey);
    return stackGroupingWithSums;
  });
  var flattenedGroupings = Object.entries(xGroupingWithSums).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        xName = _ref4[0],
        stackGrouping = _ref4[1];

    return Object.assign(_defineProperty({}, xAxisDataKey, xName), stackGrouping);
  });
  var stackDataNamesAsc = _lodash2.default.uniqBy(data, stackDataKey).map(function (d) {
    return d[stackDataKey];
  }).sort(sortStringsAsc);
  var colorMapper = {};
  stackDataNamesAsc.forEach(function (name, index) {
    return colorMapper[name] = colorsDarkToLight[index];
  });
  var stackDataNamesDesc = stackDataNamesAsc.slice(0).reverse(); // Clone and then reverse
  var stackedBar = stackDataNamesDesc.map(function (name, stackIndex) {
    return _react2.default.createElement(
      _recharts.Bar,
      { key: 'bar-' + name, dataKey: name, stackId: 'samestack' },
      flattenedGroupings.map(function (element, index) {
        return _react2.default.createElement(_recharts.Cell, {
          key: 'stacked-bar-' + element.region + '-' + index,
          fill: colorMapper[name]
        });
      })
    );
  });
  var legendData = stackDataNamesAsc.map(function (name, index) {
    return { id: name, value: name, color: colorMapper[name] };
  });

  return _react2.default.createElement(
    _recharts.BarChart,
    { width: 1100, height: 400, data: flattenedGroupings },
    _react2.default.createElement(_recharts.XAxis, { dataKey: xAxisDataKey }),
    _react2.default.createElement(_recharts.YAxis, null),
    _react2.default.createElement(_recharts.Tooltip, { content: _react2.default.createElement(TooltipContent, { colorMapper: colorMapper, xAxisDataKey: xAxisDataKey }), active: true }),
    _react2.default.createElement(_recharts.Legend, { iconType: 'circle', payload: legendData }),
    stackedBar
  );
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _recharts = require('recharts');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Reduce = require('../util/Reduce');

var _ColumnNames = require('../ColumnNames');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sortStringsAsc = function sortStringsAsc(a, b) {
  var aLower = a.toLowerCase();
  var bLower = b.toLowerCase();
  if (aLower < bLower) return -1;
  if (aLower > bLower) return 1;
  return 0;
};

var TooltipContent = function TooltipContent(_ref) {
  var active = _ref.active,
      type = _ref.type,
      payload = _ref.payload,
      label = _ref.label,
      xAxisDataKey = _ref.xAxisDataKey,
      colorMapper = _ref.colorMapper;

  if (!active) return null;
  var hoverData = payload[0].payload;
  var xAxisValue = hoverData[xAxisDataKey];
  var stackData = Object.keys(hoverData).sort(sortStringsAsc).filter(function (key) {
    return key !== xAxisDataKey;
  }).map(function (stackDataName) {
    return {
      name: stackDataName,
      value: hoverData[stackDataName],
      color: colorMapper[stackDataName]
    };
  });
  var stackContent = stackData.map(function (slice) {
    return _react2.default.createElement(
      'div',
      { key: xAxisValue + '-' + slice.name, className: 'stack-slice-content' },
      _react2.default.createElement(
        'svg',
        { width: 20, height: 20 },
        _react2.default.createElement('circle', { cx: 10, cy: 10, r: 10, fill: slice.color })
      ),
      _react2.default.createElement(
        'span',
        { className: 'stack-slice-name' },
        slice.name
      ),
      _react2.default.createElement(
        'div',
        { className: 'stack-slice-value' },
        slice.value
      )
    );
  });

  return _react2.default.createElement(
    'div',
    { className: 'tt-content', style: { width: 350, height: 'auto' } },
    _react2.default.createElement(
      'div',
      { className: 'tt-title' },
      xAxisValue
    ),
    _react2.default.createElement(
      'div',
      { className: 'tt-label' },
      hoverData.name
    ),
    stackContent
  );
};

});

require.register("assets/js/projects/entry.js", function(exports, require, module) {
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _qdFormatters = require('qd-formatters');

var _qdFormatters2 = _interopRequireDefault(_qdFormatters);

var _BreakdownPanel = require('./components/BreakdownPanel');

var _BreakdownPanel2 = _interopRequireDefault(_BreakdownPanel);

var _StackedBarChart = require('./components/StackedBarChart');

var _StackedBarChart2 = _interopRequireDefault(_StackedBarChart);

var _ColorPalette = require('./util/ColorPalette');

var _ColorPalette2 = _interopRequireDefault(_ColorPalette);

var _ColorScale = require('./util/ColorScale');

var _ColorScale2 = _interopRequireDefault(_ColorScale);

var _d2 = require('d3');

var _d3 = _interopRequireDefault(_d2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _topojson = require('topojson');

var topojson = _interopRequireWildcard(_topojson);

var _ColumnNames = require('./ColumnNames');

var _Reduce = require('./util/Reduce');

var _D3Choropleth = require('./components/D3Choropleth');

var _D3Choropleth2 = _interopRequireDefault(_D3Choropleth);

var _ProjectSearch = require('./components/ProjectSearch');

var _ProjectSearch2 = _interopRequireDefault(_ProjectSearch);

var _Data = require('./test/Data');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formatter = (0, _qdFormatters2.default)(_d3.default).numberFormat;

// Make sure each record only has one practice area
// We need this in order to group by practice area because the original data can have multiple practice areas per record
var denormalizePracticeAreas = function denormalizePracticeAreas(data) {
  var denormalizedData = [];
  Object.values(_ColumnNames.PRACTICE_AREAS).forEach(function (practiceArea) {
    var dataFilteredByPracticeArea = data.filter(function (d) {
      return d[practiceArea] === 'x';
    });
    var dataWithSinglePracticeArea = dataFilteredByPracticeArea.map(function (d) {
      return Object.assign(d, { denormalizedPracticeArea: practiceArea });
    });
    denormalizedData = denormalizedData.concat(dataWithSinglePracticeArea);
  });
  var nonePracticeAreas = data.filter(function (d) {
    var foundSomePracticeArea = Object.values(_ColumnNames.PRACTICE_AREAS).some(function (practiceArea) {
      return d[practiceArea] === 'x';
    });
    return !foundSomePracticeArea;
  }).map(function (d) {
    return Object.assign(d, { denormalizedPracticeArea: 'None' });
  });

  return denormalizedData.concat(nonePracticeAreas);
};

var chartDataFormat = function chartDataFormat(groupedValues) {
  var nameValueArray = Object.entries(groupedValues).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        value = _ref2[1];

    return { name: name, value: value };
  });
  return _lodash2.default.sortBy(nameValueArray, ['value']).slice(0).reverse();
};

document.addEventListener('DOMContentLoaded', function () {
  _d3.default.tsv('/assets/data/projects.tsv', function (data) {
    var projectsGroupedByCountry = _lodash2.default.groupBy(data, 'Country');
    var projectsGroupedByRegion = _lodash2.default.groupBy(data, 'Region');
    var projectsGroupedByPracticeArea = _lodash2.default.groupBy(denormalizePracticeAreas(data), 'denormalizedPracticeArea');
    var testGroupRegions = _lodash2.default.groupBy(_Data.regionAndPracAreas, 'region');
    var practiceAreaSumsForRegions = _lodash2.default.mapValues(testGroupRegions, function (projGroup) {
      // const denormalized = denormalizePracticeAreas(projGroup)
      var groupedByPracticeAreas = _lodash2.default.groupBy(projGroup, function (project) {
        return project.practiceArea;
      });
      var contractValuesForGroupedPracticeAreas = (0, _Reduce.reduceSum)(groupedByPracticeAreas, 'value');

      return contractValuesForGroupedPracticeAreas;
    });
    var flattenedPracticeAreaSums = Object.entries(practiceAreaSumsForRegions).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          regionName = _ref4[0],
          groupedPracticeAreaSums = _ref4[1];

      return Object.assign({ region: regionName }, groupedPracticeAreaSums);
    });

    var choroplethData = chartDataFormat((0, _Reduce.reduceCount)(projectsGroupedByCountry));
    var getCountryColor = function getCountryColor(datum) {
      return ChoroplethColorScale.getColorFor(datum.value);
    };
    var ChoroplethColorScale = new _ColorScale2.default(choroplethData, _ColorPalette2.default.colors, _ColorPalette2.default.noDataColor);
    _d3.default.json("/assets/data/countries.topo.json", function (error, world) {

      var countriesTopo = topojson.feature(world, world.objects.countries).features;

      var projectsChoropleth = (0, _D3Choropleth2.default)('projects-choropleth').topojson(countriesTopo).data(choroplethData).colorPalette(_ColorPalette2.default).tooltipContent(function (datum) {
        return datum.name + '<br/>' + datum.value + ' projects';
      }).numberFormatter(formatter).draw();
    });

    var pbpaPanel = _react2.default.createElement(_BreakdownPanel2.default, {
      data: chartDataFormat((0, _Reduce.reduceCount)(projectsGroupedByPracticeArea)),
      colorPalette: _ColorPalette2.default,
      title: 'Projects',
      groupTitle: 'Practice Area'
    });
    var pbrPanel = _react2.default.createElement(_BreakdownPanel2.default, {
      data: chartDataFormat((0, _Reduce.reduceCount)(projectsGroupedByRegion)),
      colorPalette: _ColorPalette2.default,
      title: 'Countries',
      groupTitle: 'Region'
    });

    var stackedBarChart = _react2.default.createElement(_StackedBarChart2.default, {
      data: _Data.regionAndPracAreas,
      xAxisDataKey: 'region',
      stackDataKey: 'practiceArea',
      colorPalette: _ColorPalette2.default,
      valueKey: 'value'
    });
    console.log('data loaded');

    _reactDom2.default.render(pbpaPanel, document.getElementById('projects-by-practice-area'));

    _reactDom2.default.render(pbrPanel, document.getElementById('projects-by-region'));

    _reactDom2.default.render(stackedBarChart, document.getElementById('contract-value'));

    _reactDom2.default.render(_react2.default.createElement(_ProjectSearch2.default, null), document.getElementById('project-search'));
  });
});

});

require.register("assets/js/projects/test/Data.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Dummy data

var projectsByPracticeArea = [{ name: 'Monitoring and Evaluation', value: 184 }, { name: 'Public Financial Management and Fiscal Sustainability', value: 123 }, { name: 'Knowledge Management and Data Analytics', value: 85 }, { name: 'Education, Gender and Youth', value: 37 }, { name: 'Energy and Environment', value: 12 }, { name: 'Security, Transparency, and Governence', value: 4 }];

var projectsByRegion = [{ name: 'East Asia & Oceania', value: 184 }, { name: 'Middle East & North Africa', value: 123 }, { name: 'South & Central Asia', value: 85 }, { name: 'Sub-Saharan Africa', value: 37 }, { name: 'Western Hemisphere', value: 12 }, { name: 'World', value: 9 }];

var practiceAreas = ['Monitoring and Evaluation', 'Public Financial Management and Fiscal Sustainability', 'Knowledge Management and Data Analytics', 'Education, Gender and Youth', 'Energy and Environment', 'Security, Transparency, and Governance'];

var regionAndPracAreas = [{ region: 'East Asia & Oceania', practiceArea: 'Monitoring and Evaluation', value: 100 }, { region: 'East Asia & Oceania', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 300 }, { region: 'East Asia & Oceania', practiceArea: 'Knowledge Management and Data Analytics', value: 80 }, { region: 'East Asia & Oceania', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'East Asia & Oceania', practiceArea: 'Energy and Environment', value: 80 }, { region: 'East Asia & Oceania', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'Middle East & North Africa', practiceArea: 'Monitoring and Evaluation', value: 500 }, { region: 'Middle East & North Africa', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 440 }, { region: 'Middle East & North Africa', practiceArea: 'Knowledge Management and Data Analytics', value: 400 }, { region: 'Middle East & North Africa', practiceArea: 'Education, Gender and Youth', value: 230 }, { region: 'Middle East & North Africa', practiceArea: 'Energy and Environment', value: 200 }, { region: 'Middle East & North Africa', practiceArea: 'Security, Transparency, and Governance', value: 80 }, { region: 'South & Central Asia', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'South & Central Asia', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'South & Central Asia', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'South & Central Asia', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'South & Central Asia', practiceArea: 'Energy and Environment', value: 100 }, { region: 'South & Central Asia', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'Sub-Saharan Africa', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'Sub-Saharan Africa', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'Sub-Saharan Africa', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'Sub-Saharan Africa', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'Sub-Saharan Africa', practiceArea: 'Energy and Environment', value: 100 }, { region: 'Sub-Saharan Africa', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'Western Hemisphere', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'Western Hemisphere', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'Western Hemisphere', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'Western Hemisphere', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'Western Hemisphere', practiceArea: 'Energy and Environment', value: 100 }, { region: 'Western Hemisphere', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'World', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'World', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'World', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'World', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'World', practiceArea: 'Energy and Environment', value: 100 }, { region: 'World', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'Others', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'Others', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'Others', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'Others', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'Others', practiceArea: 'Energy and Environment', value: 100 }, { region: 'Others', practiceArea: 'Security, Transparency, and Governance', value: 50 }];

exports.regionAndPracAreas = regionAndPracAreas;
exports.practiceAreas = practiceAreas;

});

require.register("assets/js/projects/util/ColorPalette.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  colors: ['#62AFD1', '#3D98C3', '#297DA6', '#1F5D7B', '#173F53', '#0E242F'],
  noDataColor: '#cae0ea'
};

});

require.register("assets/js/projects/util/ColorScale.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColorScale = function () {
  function ColorScale(data, colors) {
    var noDataColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#ddd";
    var valueAccessorFunc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (d) {
      return d.value;
    };
    var scaleType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'quantize';
    var customDomain = arguments[5];

    _classCallCheck(this, ColorScale);

    this.data = data;
    this.colors = colors;
    this.noDataColor = noDataColor;
    this.valueAccessorFunc = valueAccessorFunc;
    this.scaleType = scaleType;
    this.customDomain = customDomain;

    // Setup the scale based on scale type
    if (scaleType === 'quantize') {
      // Calculate the colors based on a linear quantize domain
      this.scale = _d2.default.scale.quantize();
    } else if (scaleType === "quantile") {
      // Calculate the colors by n domain sections(similar to quartiles but of n sections)
      this.scale = _d2.default.scale.quantile();
    }
    this.scale.domain(this.calculateDomain()).range(colors);
  }

  _createClass(ColorScale, [{
    key: 'calculateDomain',
    value: function calculateDomain() {
      if (this.customDomain) {
        return this.customDomain;
      } else if (this.scaleType === 'quantize') {
        // Standard min/max domain for linear quantize scale
        return [_d2.default.min(this.data, this.valueAccessorFunc), _d2.default.max(this.data, this.valueAccessorFunc)];
      } else if (this.scaleType === 'quantile') {
        // If the user didn't specify a list of quantiles using the customDomain
        // then use the data itself as the quantiles
        return this.data.map(this.valueAccessorFunc);
      }
    }
  }, {
    key: 'setDomain',
    value: function setDomain() {
      this.scale.domain(this.calculateDomain());
    }
  }, {
    key: 'setData',
    value: function setData(data) {
      this.data = data;
    }
  }, {
    key: 'getColorFor',
    value: function getColorFor(value) {
      if (value === undefined) {
        return this.noDataColor;
      }
      return this.scale(value);
    }
  }]);

  return ColorScale;
}();

exports.default = ColorScale;

});

require.register("assets/js/projects/util/Reduce.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduceCount = exports.reduceSum = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reduceSum = function reduceSum(grouping, valueKey) {
  return _lodash2.default.mapValues(grouping, function (recordsInGroup) {
    return recordsInGroup.reduce(function (accumulator, next) {
      return accumulator += Number(next[valueKey]);
    }, 0);
  });
};

var reduceCount = function reduceCount(grouping) {
  return _lodash2.default.mapValues(grouping, function (recordsInGroup) {
    return recordsInGroup.length;
  });
};

exports.reduceSum = reduceSum;
exports.reduceCount = reduceCount;

});

require.alias("buffer/index.js", "buffer");
require.alias("events/events.js", "events");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.d3 = require("d3");


});})();require('___globals___');

'use strict';

/* jshint ignore:start */
(function () {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = window.brunch || {};
  var ar = br['auto-reload'] = br['auto-reload'] || {};
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function cacheBuster(url) {
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function page() {
      window.location.reload(true);
    },

    stylesheet: function stylesheet() {
      [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (link) {
        var val = link.getAttribute('data-autoreload');
        return link.href && val != 'false';
      }).forEach(function (link) {
        link.href = cacheBuster(link.href);
      });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function () {
        document.body.offsetHeight;
      }, 25);
    },

    javascript: function javascript() {
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function (script) {
        return script.text;
      }).filter(function (text) {
        return text.length > 0;
      });
      var srcScripts = scripts.filter(function (script) {
        return script.src;
      });

      var loaded = 0;
      var all = srcScripts.length;
      var onLoad = function onLoad() {
        loaded = loaded + 1;
        if (loaded === all) {
          textScripts.forEach(function (script) {
            eval(script);
          });
        }
      };

      srcScripts.forEach(function (script) {
        var src = script.src;
        script.remove();
        var newScript = document.createElement('script');
        newScript.src = cacheBuster(src);
        newScript.async = true;
        newScript.onload = onLoad;
        document.head.appendChild(newScript);
      });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function connect() {
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function (event) {
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function () {
      if (connection.readyState) connection.close();
    };
    connection.onclose = function () {
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */

;
//# sourceMappingURL=projects-bundle.js.map