/* global describe, it, beforeEach, afterEach */
'use strict';
var fs = require('fs');
var assert = require('assert');
var sinon = require('sinon');
var gutil = require('gulp-util');
var proxyquire = require('proxyquire');
var stripAnsi = require('strip-ansi');
var tildify = require('tildify');

var gutilStub = {
	log: function() {
		// uncomment the next line to see the log messages written by gulp-debug
		// during test (by default they are swallowed by the sinon stub replacing the log method)
		// gutil.log.apply(gutil.log, arguments);
	}
};
var debug = proxyquire('./index', {
	'gulp-util': gutilStub
});

describe('gulp-debug', function() {
	var file;

	beforeEach(function () {
		sinon.spy(gutilStub, 'log');
		file = new gutil.File({
			cwd: __dirname,
			base: __dirname,
			path: __dirname + '/foo.js',
			stat: fs.statSync('test.js'),
			contents: new Buffer('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
		});
	});

	afterEach(function () {
		gutilStub.log.restore();
	});

	it('should output debug info', function (cb) {
		var stream = debug({title: 'unicorn'});

		stream.write(file, 'utf8', function() {
			assert(gutilStub.log.calledOnce);

			var lines = stripAnsi(gutilStub.log.firstCall.args[0]).split('\n');
			assert(/^gulp-debug: unicorn \(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC\)$/.test(lines.shift()));
			var expected = [
				'',
				'File',
				'cwd:      ' + tildify(file.cwd),
				'base:     ' + tildify(file.base),
				'path:     ' + tildify(file.path),
				'contents: Lorem ipsum dolor sit amet, consectetuer...',
				''
			];
			assert.deepEqual(lines, expected);
			cb();
		});
	});
});
