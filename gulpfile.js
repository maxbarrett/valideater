/* jshint node:true */
'use strict';

var gulp   = require('gulp');
var ghPages = require('gulp-gh-pages');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var minifyHTML = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var header = require('gulp-header');
var pkg = require('./package.json');
var info = '// <%= pkg.name %>@v<%= pkg.version %>, <%= pkg.license %>\n';


// Delete existing dist folder
gulp.task('clean', require('del').bind(null, ['./dist']));


// Lint the JS
gulp.task('jshint', function () {
  return gulp.src('js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});


// mush the files
gulp.task('html', function () {
  var assets = useref.assets({searchPath: ['app', '.']});

  return gulp.src('./*.html') // grab html file/s
    .pipe(assets)
    .pipe(gulpif('*.js', uglify())) // minify any js files
    .pipe(gulpif('*.css', minifyCss())) // minify css
    .pipe(assets.restore())
    .pipe(useref()) // rename built/minified file refs in html
    .pipe(gulpif('*.html', minifyHTML({conditionals: true, spare: true, quotes:true}))) // minify html
    .pipe(gulp.dest('./dist/')); // pipe into /dist folder
});


// Deploy to Github pages
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
	.pipe(ghPages());
});


// do the build
gulp.task('build', ['jshint', 'html'], function () {
 	return gulp.src('./dist/**/*');
});


// default task: clean up and then build
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});



