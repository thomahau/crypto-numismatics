const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

gulp.task('combine-js', function() {
	return gulp
		.src('public/js/**/*.js')
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/dist/js'));
});

gulp.task('default', ['combine-js']);
