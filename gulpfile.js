import gulp from 'gulp';
import debug from './index.js';

export default function main() {
	return gulp.src('*')
		.pipe(debug());
}
