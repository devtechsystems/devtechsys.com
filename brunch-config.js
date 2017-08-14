// See http://brunch.io for documentation.
var brunchConfig = {}

brunchConfig.conventions = {
  assets: /ignore_me/
}

brunchConfig.paths = {
  public: 'assets/brunch-compiled',
  watched: ['assets/js/projects']
}

brunchConfig.files = {
  javascripts: {
    joinTo: {
      'projects-bundle.js': 'assets/js/projects/**/*.js',
      'node-modules.js': /node_modules/
    }
  },
  stylesheets: {
    joinTo: {
      'visualizations.css': 'assets/js/projects/*.scss'
    }
  }
};

brunchConfig.plugins = {
  babel: {presets: ['latest', 'react']}
};

brunchConfig.npm = {
  globals: { d3: 'd3' }
}

module.exports = brunchConfig
