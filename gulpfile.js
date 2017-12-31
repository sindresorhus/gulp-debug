'use strict';
const gulp = require('gulp');
const debug = require('.');

gulp.task('default', () =>
	gulp.src('*')
		.pipe(debug())
);
