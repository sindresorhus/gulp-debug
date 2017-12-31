'use strict';
const path = require('path');
const fancyLog = require('fancy-log');
const through = require('through2');
const tildify = require('tildify');
const stringifyObject = require('stringify-object');
const chalk = require('chalk');
const plur = require('plur');

const prop = chalk.blue;

module.exports = options => {
	options = Object.assign({
		title: 'gulp-debug:',
		minimal: true,
		showFiles: true
	}, options);

	if (process.argv.indexOf('--verbose') !== -1) {
		options.verbose = true;
		options.minimal = false;
		options.showFiles = true;
	}

	let count = 0;

	return through.obj((file, enc, cb) => {
		if (options.showFiles) {
			const full =
				'\n' +
				(file.cwd ? 'cwd:   ' + prop(tildify(file.cwd)) : '') +
				(file.base ? '\nbase:  ' + prop(tildify(file.base)) : '') +
				(file.path ? '\npath:  ' + prop(tildify(file.path)) : '') +
				(file.stat && options.verbose ? '\nstat:  ' + prop(stringifyObject(file.stat, {indent: '       '}).replace(/[{}]/g, '').trim()) : '') +
				'\n';

			const output = options.minimal ? prop(path.relative(process.cwd(), file.path)) : full;

			module.exports._log(options.title + ' ' + output);
		}

		count++;
		cb(null, file);
	}, cb => {
		module.exports._log(options.title + ' ' + chalk.green(count + ' ' + plur('item', count)));
		cb();
	});
};

// Internal: Log function used by gulp-debug exposed for testing
module.exports._log = fancyLog;
