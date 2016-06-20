var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

// Error Handler
function errorHandler(error) {
  console.log(error.toString());
  this.emit('end');
}

// TODO: write tests
gulp.task('test', function () {
  return gulp.src(`tests/*.js`, {read: false})
    .pipe($.mocha({
      compilers: {
        js: require('babel-core/register')
      }
    }).on('error', errorHandler))
})

// Webpack Bundler
gulp.task('compile', function() {
  return gulp.src('src/*.js')
		.pipe($.babel())
		.pipe(gulp.dest('dist'));
})

// Default Tasks
gulp.task('default',
  gulp.series('test', 'compile')
);
