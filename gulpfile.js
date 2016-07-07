var gulp = require('gulp')
var $    = require('gulp-load-plugins')()

function errorHandler(error) {
  console.log(error.toString())
  this.emit('end')
}

// TODO: write tests
// gulp.task('test', function () {
//   return gulp.src(`tests/*.js`, {read: false})
//     .pipe($.mocha({
//       compilers: {
//         js: require('babel-core/register')
//       }
//     }).on('error', errorHandler))
// })

gulp.task('compile', function() {
  return gulp.src('src/*.js')
		.pipe($.babel()).on('error', errorHandler)
		.pipe(gulp.dest('dist'))
})

gulp.task('watch', function () {
  gulp.watch('src/*.js', gulp.series('compile'))
})

gulp.task('default',
  gulp.series(/*'test',*/ 'compile', 'watch')
)
