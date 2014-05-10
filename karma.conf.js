/* jshint strict: false */

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'jasmine'],
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js'
    ],
    preprocessors: {
      '/**/*.browserify': ['browserify']
    },
    browserify: {
      files: [
        'src/javascripts/**/*.js',
        'src/templates/**/*.html',
        'test/unit/**/*.js'
      ],
      transform: ['partialify']
    }
  });
};
