/* eslint-env mocha */
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const sinon = require('sinon');
const gutil = require('gulp-util');
const proxyquire = require('proxyquire');
const stripAnsi = require('strip-ansi');

const gutilStub = {
	log() {
		// uncomment the next line to see the log messages written by gulp-debug
		// during test (by default they are swallowed by the sinon stub replacing the log method)
		// gutil.log.apply(gutil.log, arguments);
	}
};

const debug = proxyquire('./', {
	'gulp-util': gutilStub
});

let file;

beforeEach(() => {
	sinon.spy(gutilStub, 'log');
	file = new gutil.File({
		cwd: __dirname,
		base: __dirname,
		path: path.join(__dirname, 'foo.js'),
		stat: fs.statSync('test.js'),
		contents: new Buffer('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
	});
});

afterEach(() => {
	gutilStub.log.restore();
});

it('should output debug info', cb => {
	const stream = debug({title: 'unicorn:'});

	stream.write(file, 'utf8', () => {
		assert(gutilStub.log.calledOnce);
		assert.strictEqual(stripAnsi(gutilStub.log.firstCall.args[0]).split('\n')[0], 'unicorn: foo.js');
		cb();
	});
});

it('should output singular item count', cb => {
	const stream = debug({title: 'unicorn:'});

	stream.on('finish', () => {
		assert.strictEqual(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0], 'unicorn: 1 item');
		cb();
	});

	stream.write(file, () => {
		stream.end();
	});
});

it('should output zero item count', cb => {
	const stream = debug({title: 'unicorn:'});

	stream.on('finish', () => {
		assert.strictEqual(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0], 'unicorn: 0 items');
		cb();
	});

	stream.end();
});

it('should output plural item count', cb => {
	const stream = debug({title: 'unicorn:'});

	stream.on('finish', () => {
		assert.strictEqual(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0], 'unicorn: 2 items');
		cb();
	});

	stream.write(file, () => {
		stream.write(file, () => {
			stream.end();
		});
	});
});
