require('dotenv').config();
const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const { NOMICS_API_KEY } = require('./config');

gulp.task('combine-js', function () {
  return gulp
    .src('public/src/js/*.js')
    .pipe(concat('script.js'))
    .pipe(
      uglify({
        compress: {
          global_defs: {
            API_KEY: NOMICS_API_KEY,
          },
        },
      })
    )
    .pipe(gulp.dest('public/build/js'));
});

gulp.task('combine-css', function () {
  return gulp
    .src('public/src/css/*.css')
    .pipe(concat('style.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/build/css'));
});

// gulp.task('copy-html', function () {
//   return gulp.src('public/index.html').pipe(gulp.dest('public/build'));
// });

// gulp.task('copy-favicon', function () {
//   return gulp.src('public/favicon.ico').pipe(gulp.dest('public/build'));
// });

// gulp.task('default', gulp.series('combine-js', 'combine-css', 'copy-html', 'copy-favicon'));
gulp.task('default', gulp.series('combine-js', 'combine-css'));
