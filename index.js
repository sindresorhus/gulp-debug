'use strict';
const path = require('path');
const gutil = require('gulp-util');
const through = require('through2');
const tildify = require('tildify');
const stringifyObject = require('stringify-object');
const chalk = require('chalk');
const plur = require('plur');

const prop = chalk.blue;

module.exports = opts => {
	opts = Object.assign({
		title: 'gulp-debug:',
		minimal: true
	}, opts);

	if (process.argv.indexOf('--verbose') !== -1) {
		opts.verbose = true;
		opts.minimal = false;
	}

	let count = 0;

	return through.obj((file, enc, cb) => {
		const full =
			'\n' +
			(file.cwd ? 'cwd:   ' + prop(tildify(file.cwd)) : '') +
			(file.base ? '\nbase:  ' + prop(tildify(file.base)) : '') +
			(file.path ? '\npath:  ' + prop(tildify(file.path)) : '') +
			(file.stat && opts.verbose ? '\nstat:  ' + prop(stringifyObject(file.stat, {indent: '       '}).replace(/[{}]/g, '').trim()) : '') +
			'\n';

		const output = opts.minimal ? prop(path.relative(process.cwd(), file.path)) : full;

		count++;

		gutil.log(opts.title + ' ' + output);

		cb(null, file);
	}, cb => {
		gutil.log(opts.title + ' ' + chalk.green(count + ' ' + plur('item', count)));
		cb();
	});
};
