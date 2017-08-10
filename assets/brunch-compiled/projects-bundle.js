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
  ECONOMIC_ANALYSIS: "Economic Analysis and M&E Practice Area",
  EDUCATION_AND_YOUTH_DEVELOPMENT: "Education and Youth Development Practice Area",
  GENDER_AND_INCLUSIVE_DEVELOPMENT: "Gender and Inclusive Development Practice Area",
  PFM_AND_INSTITUTION_BUILDING: "PFM and Institution Building Practice Area"
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

exports.default = function (_ref) {
  var groupedData = _ref.groupedData,
      colorPalette = _ref.colorPalette,
      title = _ref.title,
      groupTitle = _ref.groupTitle;

  var colorScale = new _ColorScale2.default(groupedData, colorPalette.colors, colorPalette.noDataColor);
  var totalValue = groupedData.reduce(function (accumulated, next) {
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
        _react2.default.createElement(
          _recharts.Pie,
          {
            dataKey: 'value',
            data: groupedData,
            innerRadius: 20,
            outerRadius: 50,
            cx: '50%',
            cy: '50%',
            startAngle: 90,
            endAngle: -270
          },
          groupedData.map(function (element, index) {
            return _react2.default.createElement(_recharts.Cell, { key: element.name, fill: colorScale.getColorFor(groupedData[index].value) });
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
        data: groupedData,
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

});

;require.register("assets/js/projects/components/StackedBarChart.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var data = _ref.data,
      colorPalette = _ref.colorPalette;

  return _react2.default.createElement(
    _recharts.BarChart,
    { width: 400, height: 200, data: data },
    _react2.default.createElement(_recharts.XAxis, { dataKey: 'region' }),
    _react2.default.createElement(_recharts.YAxis, { dataKey: 'value' }),
    _react2.default.createElement(_recharts.Legend, null),
    _react2.default.createElement(_recharts.Bar, { dataKey: '', stackId: 'stacked' }),
    _react2.default.createElement(_recharts.Bar, { dataKey: '', stackId: 'stacked' }),
    _react2.default.createElement(_recharts.Bar, { dataKey: '', stackId: 'stacked' }),
    _react2.default.createElement(_recharts.Bar, { dataKey: '', stackId: 'stacked' })
  );
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _recharts = require('recharts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

;require.register("assets/js/projects/entry.js", function(exports, require, module) {
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _BreakdownPanel = require('./components/BreakdownPanel');

var _BreakdownPanel2 = _interopRequireDefault(_BreakdownPanel);

var _StackedBarChart = require('./components/StackedBarChart');

var _StackedBarChart2 = _interopRequireDefault(_StackedBarChart);

var _ColorPalette = require('./util/ColorPalette');

var _ColorPalette2 = _interopRequireDefault(_ColorPalette);

var _d2 = require('d3');

var _d3 = _interopRequireDefault(_d2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ColumnNames = require('./ColumnNames');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectsByPracticeArea = [{ name: 'Monitoring and Evaluation', value: 184 }, { name: 'Public Financial Management and Fiscal Sustainability', value: 123 }, { name: 'Knowledge Management and Data Analytics', value: 85 }, { name: 'Education, Gender and Youth', value: 37 }, { name: 'Energy and Environment', value: 12 }, { name: 'Security, Transparency, and Governence', value: 4 }];

var projectsByRegion = [{ name: 'East Asia & Oceania', value: 184 }, { name: 'Middle East & North Africa', value: 123 }, { name: 'South & Central Asia', value: 85 }, { name: 'Sub-Saharan Africa', value: 37 }, { name: 'Western Hemisphere', value: 12 }, { name: 'World', value: 9 }];

var contractValue = [{ region: 'East Asia & Oceania', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'East Asia & Oceania', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'East Asia & Oceania', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'East Asia & Oceania', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'East Asia & Oceania', practiceArea: 'Energy and Environment', value: 100 }, { region: 'East Asia & Oceania', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'Middle East & North Africa', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'Middle East & North Africa', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'Middle East & North Africa', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'Middle East & North Africa', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'Middle East & North Africa', practiceArea: 'Energy and Environment', value: 100 }, { region: 'Middle East & North Africa', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'South & Central Asia', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'South & Central Asia', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'South & Central Asia', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'South & Central Asia', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'South & Central Asia', practiceArea: 'Energy and Environment', value: 100 }, { region: 'South & Central Asia', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'Sub-Saharan Africa', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'Sub-Saharan Africa', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'Sub-Saharan Africa', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'Sub-Saharan Africa', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'Sub-Saharan Africa', practiceArea: 'Energy and Environment', value: 100 }, { region: 'Sub-Saharan Africa', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'Western Hemisphere', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'Western Hemisphere', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'Western Hemisphere', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'Western Hemisphere', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'Western Hemisphere', practiceArea: 'Energy and Environment', value: 100 }, { region: 'Western Hemisphere', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'World', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'World', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'World', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'World', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'World', practiceArea: 'Energy and Environment', value: 100 }, { region: 'World', practiceArea: 'Security, Transparency, and Governance', value: 50 }, { region: 'Others', practiceArea: 'Monitoring and Evaluation', value: 550 }, { region: 'Others', practiceArea: 'Public Financial Management and Fiscal Sustainability', value: 500 }, { region: 'Others', practiceArea: 'Knowledge Management and Data Analytics', value: 350 }, { region: 'Others', practiceArea: 'Education, Gender and Youth', value: 250 }, { region: 'Others', practiceArea: 'Energy and Environment', value: 100 }, { region: 'Others', practiceArea: 'Security, Transparency, and Governance', value: 50 }];

// Make sure each record only has one practice area
// We need this in order to group by practice area because the original data can have multiple practice areas per record
var denormalizePracticeAreas = function denormalizePracticeAreas(data) {
  var denormalizedData = [];
  Object.entries(_ColumnNames.PRACTICE_AREAS).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        practiceArea = _ref2[1];

    var dataFilteredByPracticeArea = data.filter(function (d) {
      return d[practiceArea] == 'x';
    });
    var dataWithSinglePracticeArea = dataFilteredByPracticeArea.map(function (d) {
      return Object.assign(d, { denormalizedPracticeArea: practiceArea });
    });
    denormalizedData = denormalizedData.concat(dataWithSinglePracticeArea);
  });

  return denormalizedData;
};

document.addEventListener('DOMContentLoaded', function () {
  _d3.default.tsv('/assets/data/projects.tsv', function (data) {

    var projectsGroupedByRegion = _lodash2.default.groupBy(data, function (project) {
      return project['Region'];
    });
    var projectsGroupedByPracticeArea = _lodash2.default.groupBy(denormalizePracticeAreas(data), function (project) {
      return project.denormalizedPracticeArea;
    });

    var pbpaPanel = _react2.default.createElement(_BreakdownPanel2.default, {
      groupedData: projectsByPracticeArea,
      colorPalette: _ColorPalette2.default,
      title: 'Projects',
      groupTitle: 'Practice Area'
    });
    var pbrPanel = _react2.default.createElement(_BreakdownPanel2.default, {
      groupedData: projectsByRegion,
      colorPalette: _ColorPalette2.default,
      title: 'Countries',
      groupTitle: 'Region'
    });
    var stackedBarChart = _react2.default.createElement(_StackedBarChart2.default, {
      data: contractValue,
      colorPalette: _ColorPalette2.default
    });
    console.log('data loaded');

    _reactDom2.default.render(pbpaPanel, document.getElementById('projects-by-practice-area'));

    _reactDom2.default.render(pbrPanel, document.getElementById('projects-by-region'));

    _reactDom2.default.render(stackedBarChart, document.getElementById('contract-value'));
  });
});

});

require.register("assets/js/projects/util/ColorPalette.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  colors: ['#62AFD1', '#3D98C3', '#297DA6', '#1F5D7B', '#173F53', '#0E242F'],
  noDataColor: '#87C6DD'
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

require.alias("buffer/index.js", "buffer");
require.alias("events/events.js", "events");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
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