'use strict';
const gulp = require('gulp');
const debug = require('.');

exports.default = () => (
	gulp.src('*')
		.pipe(debug())
);
