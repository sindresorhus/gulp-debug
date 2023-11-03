import process from 'node:process';
import path from 'node:path';
import tildify from 'tildify';
import stringifyObject from 'stringify-object';
import chalk from 'chalk';
import plur from 'plur';
import {gulpPlugin} from 'gulp-plugin-extras';

const styleProperty = chalk.blue;

export default function gulpDebug(options) {
	options = {
		logger: console.log,
		title: 'gulp-debug:',
		minimal: true,
		showFiles: true,
		showCount: true,
		...options,
	};

	if (process.argv.includes('--verbose')) {
		options.verbose = true;
		options.minimal = false;
		options.showFiles = true;
		options.showCount = true;
	}

	let count = 0;

	return gulpPlugin('gulp-debug', file => {
		if (options.showFiles) {
			const full
				= '\n'
				+ (file.cwd ? 'cwd:   ' + styleProperty(tildify(file.cwd)) : '')
				+ (file.base ? '\nbase:  ' + styleProperty(tildify(file.base)) : '')
				+ (file.path ? '\npath:  ' + styleProperty(tildify(file.path)) : '')
				+ (file.stat && options.verbose ? '\nstat:  ' + styleProperty(stringifyObject(file.stat, {indent: '       '}).replaceAll(/[{}]/g, '').trim()) : '')
				+ '\n';

			const output = options.minimal ? styleProperty(path.relative(process.cwd(), file.path)) : full;

			options.logger(options.title + ' ' + output);
		}

		count++;

		return file;
	}, {
		supportsAnyType: true,
		async * onFinish() { // eslint-disable-line require-yield
			if (options.showCount) {
				options.logger(options.title + ' ' + chalk.green(count + ' ' + plur('item', count)));
			}
		},
	});
}
