'use strict';
var fs = require('fs');
var assert = require('assert');
var sinon = require('sinon');
var gutil = require('gulp-util');
var proxyquire = require('proxyquire');
var stripAnsi = require('strip-ansi');

var gutilStub = {
	log: function () {
		// uncomment the next line to see the log messages written by gulp-debug
		// during test (by default they are swallowed by the sinon stub replacing the log method)
		// gutil.log.apply(gutil.log, arguments);
	}
};

var debug = proxyquire('./', {
	'gulp-util': gutilStub
});

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
	var stream = debug({title: 'unicorn:'});

	stream.write(file, 'utf8', function () {
		assert(gutilStub.log.calledOnce);
		assert.strictEqual(stripAnsi(gutilStub.log.firstCall.args[0]).split('\n')[0],  'unicorn: foo.js');
		cb();
	});
});

it('should output singular item count', function (cb) {
	var stream = debug({title: 'unicorn:'});

	stream.on('finish', function () {
		assert.strictEqual(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0],  'unicorn: 1 item');
		cb();
	});

	stream.write(file, 'utf8', function () {
		stream.end();
	});
});

it('should output zero item count', function (cb) {
	var stream = debug({title: 'unicorn:'});

	stream.on('finish', function () {
		assert.strictEqual(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0],  'unicorn: 0 items');
		cb();
	});
	
	stream.end();
});

it('should output plural item count', function (cb) {
	var stream = debug({title: 'unicorn:'});

	stream.on('finish', function () {
		assert.strictEqual(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0],  'unicorn: 2 items');
		cb();
	});

	stream.write(file, 'utf8', function () {
		stream.write(file, 'utf8', function () {
			stream.end();
		});
	});
});
