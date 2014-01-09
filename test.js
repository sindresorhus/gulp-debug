'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var debug = require('./index');
var out = process.stdout.write.bind(process.stdout);

it('should output debug info', function (cb) {
	var stream = debug();

	process.stdout.write = function (str) {
		out(str);

		if (/contents/.test(str)) {
			assert(true);
			process.stdout.write = out;
			cb();
		}
	};

	stream.write(new gutil.File({
		path: 'foo.js',
		contents: new Buffer('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
	}));

	stream.end();
});
