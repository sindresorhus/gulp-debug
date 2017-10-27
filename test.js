import fs from 'fs';
import path from 'path';
import test from 'ava';
import sinon from 'sinon';
import gutil from 'gulp-util';
import proxyquire from 'proxyquire';
import stripAnsi from 'strip-ansi';
import pEvent from 'p-event';

const gutilStub = {
	log() {
		// Uncomment the next line to see the log messages written by `gulp-debug` during test
		// (by default they are swallowed by the sinon stub replacing the log method)
		// gutil.log.apply(gutil.log, arguments);
	}
};

const debug = proxyquire('.', {
	'gulp-util': gutilStub
});

let file;

test.beforeEach(() => {
	sinon.spy(gutilStub, 'log');

	file = new gutil.File({
		cwd: __dirname,
		base: __dirname,
		path: path.join(__dirname, 'foo.js'),
		stat: fs.statSync('test.js'),
		contents: Buffer.from('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
	});
});

test.afterEach(() => {
	gutilStub.log.restore();
});

test('output debug info', async t => {
	const stream = debug({title: 'unicorn:'});
	const finish = pEvent(stream, 'finish');
	stream.end(file);
	await finish;

	t.is(stripAnsi(gutilStub.log.firstCall.args[0]).split('\n')[0], 'unicorn: foo.js');
});

test('output singular item count', async t => {
	const stream = debug({title: 'unicorn:'});
	const finish = pEvent(stream, 'finish');
	stream.end(file);
	await finish;

	t.is(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0], 'unicorn: 1 item');
});

test('output zero item count', async t => {
	const stream = debug({title: 'unicorn:'});
	const finish = pEvent(stream, 'finish');
	stream.end();
	await finish;

	t.is(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0], 'unicorn: 0 items');
});

test('output plural item count', async t => {
	const stream = debug({title: 'unicorn:'});
	const finish = pEvent(stream, 'finish');

	stream.write(file, () => {
		stream.end(file);
	});

	await finish;

	t.is(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0], 'unicorn: 2 items');
});

test('not output file names when `showFiles` is false.', async t => {
	const stream = debug({
		title: 'unicorn:',
		showFiles: false
	});
	const finish = pEvent(stream, 'finish');

	stream.write(file, () => {
		t.true(gutilStub.log.notCalled);
		stream.end();
	});

	await finish;

	t.is(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0], 'unicorn: 1 item');
});

test('not output count when `showCount` is false.', async t => {
	const stream = debug({
		title: 'unicorn:',
		showCount: false
	});
	const finish = pEvent(stream, 'finish');

	stream.write(file, () => {
		t.true(gutilStub.log.notCalled);
		stream.end();
	});

	await finish;

	t.not(stripAnsi(gutilStub.log.lastCall.args[0]).split('\n')[0], 'unicorn: 1 item');
});
