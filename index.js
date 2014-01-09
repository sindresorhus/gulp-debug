'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through');
var tildify = require('tildify');
var dateTime = require('date-time');
var prop = gutil.colors.blue;
var header = gutil.colors.underline;

module.exports = function (options) {
	return through(function (file) {
		if (file.isStream()) {
			return this.emit('error', new gutil.PluginError('gulp-debug', 'Streaming not supported'));
		}

		var fileObj =
			(file.cwd ? 'cwd:      ' + prop(tildify(file.cwd)) : '') +
			(file.base ? '\nbase:     ' + prop(tildify(file.base)) : '') +
			(file.path ? '\npath:     ' + prop(tildify(file.path)) : '') +
			(file.stat ? '\nstat:     ' + prop(file.stat) : '') +
			(file.contents ? '\ncontents: ' + prop(file.contents.toString('utf8', 0, 40).trim() + '...\n') : '');

		gutil.log(
			'gulp-debug: ' + gutil.colors.gray('(' + dateTime() + ')') + '\n\n' +
			header('File\n') + fileObj
		);

		this.queue(file);
	}, function () {
		gutil.log('gulp-debug: ' + gutil.colors.magenta('end') + ' event fired ' + gutil.colors.gray('(' + dateTime() + ')'));
		this.queue(null);
	});
};
