import fs from 'fs';
import path from 'path';
import test from 'ava';
import sinon from 'sinon';
import Vinyl from 'vinyl';
import stripAnsi from 'strip-ansi';
import pEvent from 'p-event';
import debug from '.';

const sandbox = sinon.sandbox.create();

let file;

test.beforeEach(() => {
	sandbox.spy(debug, '_log');

	file = new Vinyl({
		cwd: __dirname,
		base: __dirname,
		path: path.join(__dirname, 'foo.js'),
		stat: fs.statSync('test.js'),
		contents: Buffer.from('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
	});
});

test.afterEach(() => {
	sandbox.restore();
});

test('output debug info', async t => {
	const stream = debug({title: 'unicorn:'});
	const finish = pEvent(stream, 'finish');
	stream.end(file);
	await finish;

	t.is(stripAnsi(debug._log.firstCall.args[0]).split('\n')[0], 'unicorn: foo.js');
});

test('output singular item count', async t => {
	const stream = debug({title: 'unicorn:'});
	const finish = pEvent(stream, 'finish');
	stream.end(file);
	await finish;

	t.is(stripAnsi(debug._log.lastCall.args[0]).split('\n')[0], 'unicorn: 1 item');
});

test('output zero item count', async t => {
	const stream = debug({title: 'unicorn:'});
	const finish = pEvent(stream, 'finish');
	stream.end();
	await finish;

	t.is(stripAnsi(debug._log.lastCall.args[0]).split('\n')[0], 'unicorn: 0 items');
});

test('output plural item count', async t => {
	const stream = debug({title: 'unicorn:'});
	const finish = pEvent(stream, 'finish');

	stream.write(file, () => {
		stream.end(file);
	});

	await finish;

	t.is(stripAnsi(debug._log.lastCall.args[0]).split('\n')[0], 'unicorn: 2 items');
});

test('not output file names when `showFiles` is false.', async t => {
	const stream = debug({
		title: 'unicorn:',
		showFiles: false
	});
	const finish = pEvent(stream, 'finish');

	stream.write(file, () => {
		t.true(debug._log.notCalled);
		stream.end();
	});

	await finish;

	t.is(stripAnsi(debug._log.lastCall.args[0]).split('\n')[0], 'unicorn: 1 item');
});
