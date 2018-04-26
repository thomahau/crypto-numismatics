const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;

gulp.task('combine-js', function() {
	return gulp
		.src('public/js/*.js') // 'public/src/js/*.js'
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/build/js'));
});

gulp.task('minify-css', function() {
	return gulp
		.src('public/css/*.css') // 'public/src/css/*.css'
		.pipe(concat('style.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('public/build/css'));
});

gulp.task('default', ['combine-js', 'minify-css']);
