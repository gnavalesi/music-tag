var gulp = require('gulp'),
	jshint = require('gulp-jshint');

gulp.task('build', function() {

});

gulp.task('dist', ['build'], function() {

});

gulp.task('jshint', function() {
	return gulp.src(['./src/**/*.js', './test/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('test', function() {

});

gulp.task('coverage', function() {

});