var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha');

gulp.task('jshint', function () {
	return gulp.src(['./src/**/*.js', './test/**/*.js'])
			.pipe(jshint())
			.pipe(jshint.reporter('default'));
});

gulp.task('build', ['jshint'], function () {

});

gulp.task('test', ['build'], function () {
	return gulp.src('./test/**/*.js', {read: false})
			.pipe(mocha());
});

gulp.task('coverage', ['build'], function () {

});

gulp.task('dist', ['build'], function () {

});





