'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var tildify = require('tildify');
var stringifyObject = require('stringify-object');
var chalk = require('chalk');
var deepAssign = require('deep-assign');

module.exports = function (opts) {
    opts = deepAssign({
        title: 'gulp-debug:',
        minimal: true,
        chalk: {
            full: 'blue',
            minimal: 'blue',
            result: 'green'
        }
    }, opts);

    if (process.argv.indexOf('--verbose') !== -1) {
        opts.verbose = true;
        opts.minimal = false;
    }

    var count = 0,
        output;

    return through.obj(function (file, enc, cb) {

        output = opts.minimal && createChalk(opts.chalk.minimal)(tildify(path.relative(process.cwd(), file.path))) ||
            '\n' +
            (file.cwd ? 'cwd:   ' + createChalk(opts.chalk.full)(tildify(file.cwd)) : '') +
            (file.base ? '\nbase:  ' + createChalk(opts.chalk.full)(tildify(file.base)) : '') +
            (file.path ? '\npath:  ' + createChalk(opts.chalk.full)(tildify(file.path)) : '') +
            (file.stat && opts.verbose ? '\nstat:' + chalk[opts.chalk.full](stringifyObject(file.stat, {indent: '       '}).replace(/[{}]/g, '').trimRight()) : '') +
            '\n';

        count++;

        gutil.log(opts.title + ' ' + output);

        cb(null, file);
    }, function (cb) {
        gutil.log(opts.title + ' ' + createChalk(opts.chalk.result)(count + ' items'));
        cb();
    });

    function createChalk(string) {
        var parts = string.split('.');
        for (var i = 0; i < parts.length; i++) {
            chalk = chalk[parts[i]];
        }
        return chalk;
    }
};
