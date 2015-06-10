'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var tildify = require('tildify');
var stringifyObject = require('stringify-object');
var chalk = require('chalk');
var objectAssign = require('object-assign');
var prop = chalk.blue;

module.exports = function (opts) {
	opts = objectAssign({
		title: 'gulp-debug:',
		minimal: true,
		zeroItems: true
	}, opts);

	if (process.argv.indexOf('--verbose') !== -1) {
		opts.verbose = true;
		opts.minimal = false;
	}

	var count = 0;

	return through.obj(function (file, enc, cb) {
		var full =
			'\n' +
			(file.cwd ? 'cwd:   ' + prop(tildify(file.cwd)) : '') +
			(file.base ? '\nbase:  ' + prop(tildify(file.base)) : '') +
			(file.path ? '\npath:  ' + prop(tildify(file.path)) : '') +
			(file.stat && opts.verbose ? '\nstat:' + prop(stringifyObject(file.stat, {indent: '       '}).replace(/[{}]/g, '').trimRight()) : '') +
			'\n';

		var output = opts.minimal ? prop(tildify(path.relative(process.cwd(), file.path))) : full;

		count++;

		gutil.log(opts.title + ' ' + output);

		cb(null, file);
	}, function (cb) {
		if ( opts.zeroItems === true || count !== 0 ) {
			gutil.log(opts.title + ' ' + chalk.green(count + ' items'));
		}
		cb();
	});
};
