'use strict';
var gulp = require('gulp');
var debug = require('./');

gulp.task('default', function () {
	return gulp.src('*').pipe(debug());
});
