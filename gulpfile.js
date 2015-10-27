require('babel-core/register');
require('glob').sync('./tasks/gulp-*').forEach(require);
require('gulp').task('default', ['build:watch']);
