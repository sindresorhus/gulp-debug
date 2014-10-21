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

    var count = 0;
	var title = options.title ? options.title + ' ' : 'gulp-debug: ';

	return through.obj(function (file, enc, cb) {
        count++;

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-debug', 'Streaming not supported'));
			return;
		}

		var trim = function (buf) {
			return buf.toString('utf8', 0, options.verbose ? 1000 : 40).trim() + '...\n';
		};

        if (options.minimal) {

            gutil.log(title + (file.path ? prop(tildify(file.path)) : '(no path)'));

        } else {

            var fileObj =
                (file.cwd ? 'cwd:      ' + prop(tildify(file.cwd)) : '') +
                (file.base ? '\nbase:     ' + prop(tildify(file.base)) : '') +
                (file.path ? '\npath:     ' + prop(tildify(file.path)) : '') +
                (file.stat && options.verbose ? '\nstat:     ' + prop(stringifyObject(file.stat)) : '') +
                (file.contents ? '\ncontents: ' + prop(trim(file.contents)) : '');

            gutil.log(
                    title + chalk.gray('(' + dateTime() + ')') + '\n\n' +
                    header('File\n') + fileObj
            );
        }

		cb(null, file);
	}, function (cb) {
        if (!options.minimal) {
            gutil.log(title + chalk.magenta('end') + ' event fired ' + chalk.gray('(' + dateTime() + ')'));
        }

        if (options.count) {
            gutil.log(title + chalk.magenta(count) + ' files processed');
        }

		cb();
	});
};
