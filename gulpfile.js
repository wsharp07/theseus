'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var jasmineNode = require('gulp-jasmine-node');

// Entry
gulp.task('default', ['browser-sync','sass:watch'], function () {
});

// Browser Sync
gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: ["dist/**/*.*", "src/views/**/*.jade"],
        browser: "google chrome",
        port: 7000,
	});
});

// NodeMon
gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

// Sass Compile
gulp.task('sass', function () {
  return gulp.src('./src/stylesheets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/stylesheets'));
});

// Sass Watch 
gulp.task('sass:watch', function () {
  gulp.watch('./src/stylesheets/**/*.scss', ['sass']);
});

// Tests
gulp.task('test', function () {
    return gulp.src(['./src/specs/**/*Spec.js']).pipe(jasmineNode({
        timeout: 10000
    }));
});