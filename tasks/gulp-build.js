var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('build', function () {
  return gulp.src('./src/amplitude.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});
