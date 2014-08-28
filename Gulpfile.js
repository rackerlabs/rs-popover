/* global require */

var gulp = require('gulp');
var annotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var html2js = require('gulp-ng-html2js');
var rimraf = require('gulp-rimraf');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var merge = require('merge-stream');

var karma = require('karma');
var karmaConfig = {
  browsers: ['PhantomJS'],
  frameworks: ['jasmine'],
  reporters: ['dots'],
  preprocessors: {
    '**/*.html': ['html2js']
  },
  ngHtml2JsPreprocessor: {
    moduleName: 'rs.popover',
    stripPrefix: 'src/templates/'
  },
  files: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/javascripts/module.js',
    'src/javascripts/**/*.js',
    'src/templates/**/*.html',
    'test/**/*.js'
  ]
};

gulp.task('clean', function () {
  'use strict';

  return gulp.src(['coverage/**/*', 'dist/**/*'])
    .pipe(rimraf());
});

gulp.task('build:concat', ['clean'], function () {
  'use strict';

  var javascripts = gulp.src(['src/javascripts/module.js', 'src/javascripts/**/*.js']);
  var templates = gulp.src('src/templates/**/*.html')
    .pipe(html2js({ moduleName: 'rs.popover' }));

  return merge(javascripts, templates)
    .pipe(sourcemaps.init())
      .pipe(annotate())
      .pipe(concat('rs-popover.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:min', ['clean'], function () {
  'use strict';

  var javascripts = gulp.src(['src/javascripts/module.js', 'src/javascripts/**/*.js']);
  var templates = gulp.src('src/templates/**/*.html')
    .pipe(html2js({ moduleName: 'rs.popover' }));

  return merge(javascripts, templates)
    .pipe(sourcemaps.init())
      .pipe(annotate())
      .pipe(concat('rs-popover.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', function () {
  'use strict';

  return gulp.src(['src/javascripts/**/*.js', 'test/**/*.js', 'Gulpfile.js', 'karma.conf.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function (done) {
  'use strict';

  karmaConfig.singleRun = true;
  karmaConfig.reporters.push('coverage');
  karmaConfig.coverageReporter = { type: 'lcovonly', dir: 'coverage' };
  karmaConfig.preprocessors['src/javascripts/**/*.js'] = ['coverage'];

  karma.server.start(karmaConfig, done);
});

gulp.task('test:watch', function (done) {
  'use strict';

  karma.server.start(karmaConfig, done);
});

gulp.task('server', ['build:concat', 'build:min'], function () {
  'use strict';

  gulp.watch(['src/**/*'], ['build:concat', 'build:min']);

  return gulp.src(['bower_components', 'docs', 'dist'])
    .pipe(webserver({ livereload: true }));
});

gulp.task('default', ['lint', 'test', 'build:concat', 'build:min']);
