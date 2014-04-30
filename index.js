'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var tildify = require('tildify');
var dateTime = require('date-time');
var stringifyObject = require('stringify-object');
var chalk = require('chalk');
var prop = chalk.blue;
var header = chalk.underline;

module.exports = function (options) {
	options = options || {};

	var title = options.title ? options.title + ' ' : '';

	return through.obj(function (file, enc, cb) {
		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-debug', 'Streaming not supported'));
			return cb();
		}

		var transform;
		if (typeof options.transform === 'function') {
			transform = function(file) {
				return ' ' + prop(options.transform(file));
			};
		} else {

			var trim = function (buf) {
				return buf.toString('utf8', 0, options.verbose ? 1000 : 40).trim() + '...\n';
			};

			transform = function(file) {
				return '\n' +
					(file.cwd ? 'cwd:      ' + prop(tildify(file.cwd)) : '') +
					(file.base ? '\nbase:     ' + prop(tildify(file.base)) : '') +
					(file.path ? '\npath:     ' + prop(tildify(file.path)) : '') +
					(file.stat && options.verbose ? '\nstat:     ' + prop(stringifyObject(file.stat)) : '') +
					(file.contents ? '\ncontents: ' + prop(trim(file.contents)) : '');
			};
		}

		gutil.log(
			'gulp-debug: ' + title + chalk.gray('(' + dateTime() + ')') + '\n\n' +
			header('File') + transform(file)
		);

		this.push(file);
		cb();
	}, function (cb) {
		gutil.log('gulp-debug: ' + title + chalk.magenta('end') + ' event fired ' + chalk.gray('(' + dateTime() + ')'));
		cb();
	});
};
