'use strict';
var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var debug = require('./index');
var out = process.stdout.write.bind(process.stdout);

it('should output debug info', function (cb) {
	var stream = debug({title: 'unicorn'});

	process.stdout.write = function (str) {
		out(str);

		if (/contents/.test(str)) {
			assert(true);
			process.stdout.write = out;
			cb();
		}
	};

	stream.write(new gutil.File({
		cwd: __dirname,
		base: __dirname,
		path: __dirname + '/foo.js',
		stat: fs.statSync('test.js'),
		contents: new Buffer('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
	}));
});
