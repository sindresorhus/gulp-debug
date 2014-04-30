/* global describe, it, beforeEach, afterEach */
'use strict';
var fs = require('fs');
var assert = require('assert');
var sinon = require('sinon');
var gutil = require('gulp-util');
var proxyquire = require('proxyquire');
var gutilStub = {
	log: function() {
		gutil.log.apply(gutil.log, arguments);
	}
};
var debug = proxyquire('./index', {
	'gulp-util': gutilStub
});
//var out = process.stdout.write.bind(process.stdout);

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
			assert(/contents/.test('' + gutilStub.log.firstCall.args));
			cb();
		});
	});

	it('should use the transformation function if given', function (done) {
		var stream = debug({
			transform: function (file) {
				return 'moo: ' + file.path;
			}
		});

		stream.write(file, 'utf8', function() {
			assert(gutilStub.log.calledOnce);
			assert(new RegExp('moo: ' + file.path.replace('/', '\\/')).test('' + gutilStub.log.firstCall.args));
			done();
		});
	});
});
