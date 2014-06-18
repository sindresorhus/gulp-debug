'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var tildify = require('tildify');
var dateTime = require('date-time');
var stringifyObject = require('stringify-object');
var extend = require('extend');
var chalk = require('chalk');
var prop = chalk.blue;
var header = chalk.underline;

module.exports = function (options) {
	options = options || {};
	var defaultColors = {
		'title' : 'white',
		'propName' : 'white',
		'propVal' : 'white',
		'endLine' : 'white'
	};
	
	var title = options.title ? options.title + ' ' : '',
		colors = extend(defaultColors, options.colors),
		chalkColor = function(color){
			if(color in chalk){
				return chalk[color]
			} else {
				gutil.log('only chalk colors available!! ' + color + 'isn\'t available ');
			}
		};

	return through.obj(function (file, enc, cb) {
		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-debug', 'Streaming not supported'));
			return cb();
		}

		var trim = function (buf) {
			return buf.toString('utf8', 0, options.verbose ? 1000 : 40).trim() + '...\n';
		}

		var fileObj =
			(file.cwd ? chalkColor(colors.propName)('cwd:      ') + chalkColor(colors.propVal)(tildify(file.cwd)) : '') +
			(file.base ? chalkColor(colors.propName)('\nbase:     ') + chalkColor(colors.propVal)(tildify(file.base)) : '') +
			(file.path ? chalkColor(colors.propName)('\npath:     ') + chalkColor(colors.propVal)(tildify(file.path)) : '') +
			(file.stat && options.verbose ? chalkColor(colors.propName)('\nstat:     ') + chalkColor(colors.propVal)(stringifyObject(file.stat)) : '') +
			(file.contents ? chalkColor(colors.propName)('\ncontents: ') + chalkColor(colors.propVal)(trim(file.contents)) : '');

		gutil.log(
			chalkColor(colors.title)('gulp-debug: ' + title + '(' + dateTime() + ')') + '\n\n' +
			header('File\n') + fileObj
		);

		this.push(file);
		cb();
	}, function (cb) {
		gutil.log(chalkColor(colors.endLine)('gulp-debug: ' + title + 'end' + ' event fired ' + '(' + dateTime() + ')'));
		cb();
	});
};
