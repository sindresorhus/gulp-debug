# [gulp](https://github.com/wearefractal/gulp)-debug [![Build Status](https://secure.travis-ci.org/sindresorhus/gulp-debug.png?branch=master)](http://travis-ci.org/sindresorhus/gulp-debug)

> Debug [vinyl](https://github.com/wearefractal/vinyl) file streams

![](screenshot.png)


## Install

Install with [npm](https://npmjs.org/package/gulp-debug)

```
npm install --save-dev gulp-debug
```


## Example

```js
var gulp = require('gulp');
var debug = require('gulp-debug');

gulp.task('default', function () {
	gulp.src('foo.js')
		.pipe(debug())
		.pipe(gulp.dest('dist'));
});
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
