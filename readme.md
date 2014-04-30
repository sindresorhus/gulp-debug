# [gulp](http://gulpjs.com)-debug [![Build Status](https://travis-ci.org/sindresorhus/gulp-debug.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-debug)

> Debug [vinyl](https://github.com/wearefractal/vinyl) file streams

![](screenshot.png)


## Install

```bash
$ npm install --save-dev gulp-debug
```


## Usage

```js
var gulp = require('gulp');
var debug = require('gulp-debug');

gulp.task('default', function () {
	return gulp.src('foo.js')
		.pipe(debug({verbose: true}))
		.pipe(gulp.dest('dist'));
});
```


## API

### debug(options)

#### options

##### title

Type: `string`  
Default: ''

Give it a title so it's possible to distinguish the output of multiple instances logging at once.

##### verbose

Type: `Boolean`  
Default: `false`

Show more debugging:

- the file [stat object](http://nodejs.org/api/fs.html#fs_class_fs_stats)
- shows more of the contents, from 40 bytes to 400 bytes

##### transform

Type: `Function`
Default: `undefined`

This function gets called with the current processed `file` as only parameter. The return value is used in the log output.

Usage:
```javascript
var gulp = require('gulp');
var debug = require('gulp-debug');

gulp.task('default', function () {
	return gulp.src('foo.js')
		.pipe(debug({
			transform: function(file) {
				return file.path;
			}
		}))
		.pipe(gulp.dest('dist'));
});
```

## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
