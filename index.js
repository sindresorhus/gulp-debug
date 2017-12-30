'use strict';
const path = require('path');
const fancyLog = require('fancy-log');
const through = require('through2');
const tildify = require('tildify');
const stringifyObject = require('stringify-object');
const chalk = require('chalk');
const plur = require('plur');

const prop = chalk.blue;

module.exports = opts => {
	opts = Object.assign({
		title: 'gulp-debug:',
		minimal: true,
		showFiles: true
	}, opts);

	if (process.argv.indexOf('--verbose') !== -1) {
		opts.verbose = true;
		opts.minimal = false;
		opts.showFiles = true;
	}

	let count = 0;

	return through.obj((file, enc, cb) => {
		if (opts.showFiles) {
			const full =
				'\n' +
				(file.cwd ? 'cwd:   ' + prop(tildify(file.cwd)) : '') +
				(file.base ? '\nbase:  ' + prop(tildify(file.base)) : '') +
				(file.path ? '\npath:  ' + prop(tildify(file.path)) : '') +
				(file.stat && opts.verbose ? '\nstat:  ' + prop(stringifyObject(file.stat, {indent: '       '}).replace(/[{}]/g, '').trim()) : '') +
				'\n';

			const output = opts.minimal ? prop(path.relative(process.cwd(), file.path)) : full;

			module.exports._log(opts.title + ' ' + output);
		}

		count++;
		cb(null, file);
	}, cb => {
		module.exports._log(opts.title + ' ' + chalk.green(count + ' ' + plur('item', count)));
		cb();
	});
};

// Internal: Log function used by gulp-debug exposed for testing.
module.exports._log = fancyLog;
