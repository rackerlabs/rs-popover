/* jshint strict: false */
/* jshint curly: false */

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var exec = require('child_process').exec;
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('clean', function () {
  return gulp.src('dist')
    .pipe(clean());
});

gulp.task('connect', function () {
  return connect.server({
    root: ['bower_components', 'dist', 'docs'],
    port: 8000,
    livereload: true
  });
});

gulp.task('docs', function () {
  return gulp.src('docs')
    .pipe(connect.reload());
});

gulp.task('javascript', function () {
  return gulp.src('src/javascripts/module.js')
    .pipe(browserify({ debug: true, transform: ['partialify'] }))
      .pipe(rename('rs-popover.js'))
      .pipe(gulp.dest('dist'))
    .pipe(uglify())
      .pipe(rename('rs-popover.min.js'))
      .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('lint', function () {
  return gulp.src(['gulpfile.js', 'karma.conf.js', 'src/javascripts/**/*.js', 'test/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', function (error) { throw error; });
});

gulp.task('test:unit', function (done) {
  exec('node_modules/karma/bin/karma start --single-run --no-auto-watch', function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);

    if (error) throw error;

    done(error);
  });
});

gulp.task('watch', function () {
  gulp.watch('docs/**/*', ['docs']);
  gulp.watch('src/**/*', ['javascript']);
});

gulp.task('default', ['test', 'dist']);
gulp.task('dist', ['clean', 'javascript', 'docs']);
gulp.task('server', ['dist', 'connect', 'watch']);
gulp.task('test', ['lint', 'test:unit']);
