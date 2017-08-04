// See http://brunch.io for documentation.
var exports = {}

exports.conventions = {
  assets: /ignore_me/
}

exports.paths = {
  public: 'assets/brunch-compiled',
  watched: ['assets/js/projects']
}

exports.files = {
  javascripts: {
    joinTo: {
      'projects-bundle.js': 'assets/js/projects/*.js',
      'node-modules.js': /node_modules/
    }
  },
  stylesheets: {
    joinTo: {
      'visualizations.css': 'assets/js/projects/*.css'
    }
  }
};

exports.plugins = {
  babel: {presets: ['latest', 'react']}
};

module.exports = exports
