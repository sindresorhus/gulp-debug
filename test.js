import fs from 'fs';
import path from 'path';
import test from 'ava';
import Vinyl from 'vinyl';
import stripAnsi from 'strip-ansi';
import pEvent from 'p-event';
import debug from '.';

const logInspect = {
	messages: [],
	logger(msg) {
		logInspect.messages.push(stripAnsi(msg));
	},
	get notCalled() {
		return this.messages.length === 0;
	},
	get firstMessage() {
		return this.messages[0];
	},
	get lastMessage() {
		return this.messages[this.messages.length - 1];
	}
};

let file;

test.beforeEach(() => {
	logInspect.messages = [];

	file = new Vinyl({
		cwd: __dirname,
		base: __dirname,
		path: path.join(__dirname, 'foo.js'),
		stat: fs.statSync('test.js'),
		contents: Buffer.from('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
	});
});

test('output debug info', async t => {
	const stream = debug({
		logger: logInspect.logger,
		title: 'unicorn:'
	});
	const finish = pEvent(stream, 'finish');
	stream.end(file);
	await finish;

	t.is(logInspect.firstMessage, 'unicorn: foo.js');
});

test('output singular item count', async t => {
	const stream = debug({
		logger: logInspect.logger,
		title: 'unicorn:'
	});
	const finish = pEvent(stream, 'finish');
	stream.end(file);
	await finish;

	t.is(logInspect.lastMessage, 'unicorn: 1 item');
});

test('output zero item count', async t => {
	const stream = debug({
		logger: logInspect.logger,
		title: 'unicorn:'
	});
	const finish = pEvent(stream, 'finish');
	stream.end();
	await finish;

	t.is(logInspect.lastMessage, 'unicorn: 0 items');
});

test('output plural item count', async t => {
	const stream = debug({
		logger: logInspect.logger,
		title: 'unicorn:'
	});
	const finish = pEvent(stream, 'finish');

	stream.write(file, () => {
		stream.end(file);
	});

	await finish;

	t.is(logInspect.lastMessage, 'unicorn: 2 items');
});

test('do not output file names when `showFiles` is false', async t => {
	const stream = debug({
		logger: logInspect.logger,
		title: 'unicorn:',
		showFiles: false
	});
	const finish = pEvent(stream, 'finish');

	stream.write(file, () => {
		t.true(logInspect.notCalled);
		stream.end();
	});

	await finish;

	t.is(logInspect.lastMessage, 'unicorn: 1 item');
});

test('using the default logger', async t => {
	const stream = debug();
	const finish = pEvent(stream, 'finish');
	stream.end(file);
	await finish;

	t.pass();
});

test('do not output count when `showCount` is false', async t => {
	const stream = debug({
		logger: logInspect.logger,
		title: 'unicorn:',
		showCount: false
	});
	const finish = pEvent(stream, 'finish');

	stream.write(file, () => {
		stream.end(file);
	});

	await finish;

	t.not(logInspect.lastMessage, 'unicorn: 1 item');
});
