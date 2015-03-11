/* jshint node:true */
'use strict';

var gulp   = require('gulp');
var ghPages = require('gulp-gh-pages');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyHTML = require('gulp-minify-html');


// Delete existing dist folder
gulp.task('clean', require('del').bind(null, ['dist']));


// Lint Task
gulp.task('jshint', function () {
  return gulp.src('js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});


// Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(rename(function (path) {
        	path.basename += "-min";
    	}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});


// Minify HTML
gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true,
    quotes:true
  };
 
  return gulp.src('./*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./dist/'));
});


// Deploy to Github pages
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
	.pipe(ghPages());
});


gulp.task('build', ['jshint', 'scripts', 'minify-html'], function () {
 	return gulp.src('./dist/**/*');
});


gulp.task('default', ['clean'], function () {
  gulp.start('build');
});



