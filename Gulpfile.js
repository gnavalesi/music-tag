var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	istanbul = require('gulp-istanbul'),
	mocha = require('gulp-mocha'),
	clean = require('gulp-clean'),
	coveralls = require('gulp-coveralls');

gulp.task('clean', function () {
	return gulp.src(['./build/**/*.js'])
		.pipe(clean());
});

gulp.task('jshint', function () {
	return gulp.src(['./src/**/*.js', './test/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('build', ['jshint', 'clean'], function () {
	return gulp.src(['./src/**/*.js'])
		.pipe(gulp.dest('./build'));
});

gulp.task('coverage', ['build'], function () {
	return gulp.src(['./src/**/*.js'])
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
});

gulp.task('test-coverage', ['coverage'], function() {
	return gulp.src('./test/**/*.js')
			.pipe(mocha())
			.pipe(istanbul.writeReports())
			.pipe(istanbul.enforceThresholds({thresholds: {global: 30}}));
});

gulp.task('test', function () {
	return gulp.src('./test/**/*.js')
		.pipe(mocha())
		.on('error', function (error) {
			console.log(error);
			this.emit('end');
		});
});

gulp.task('dev', ['test'], function () {
	return gulp.watch(['./src/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('dev-coverage', ['test-coverage'], function () {
	return gulp.watch(['./src/**/*.js', './test/**/*.js'], ['test-coverage']);
});

gulp.task('dist', ['test-coverage'], function () {

});

gulp.task('ci', ['dist'], function() {
	return gulp.src('./coverage/**/lcov.info')
			.pipe(coveralls());
});





