import gulp from 'gulp';
import babel from 'gulp-babel';

gulp.task('build', () => {
  return gulp.src('./src/amplitude.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('build:watch', ['build'], () => {
  gulp.watch(['src/**'], ['build']);
});
