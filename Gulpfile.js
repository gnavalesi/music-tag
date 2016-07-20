var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	istanbul = require('gulp-istanbul'),
	mocha = require('gulp-mocha'),
	clean = require('gulp-clean');

gulp.task('clean', function () {
	return gulp.src(['./build/**/*.js'])
		.pipe(clean());
});

gulp.task('jshint', function () {
	return gulp.src(['./src/**/*.js', './test/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('test', ['clean', 'jshint'], function () {
	return gulp.src('./test/**/*.js')
		.pipe(mocha());
});

gulp.task('pre-coverage', ['clean', 'jshint'], function () {
	return gulp.src(['./src/**/*.js'])
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
});

gulp.task('coverage', ['pre-coverage'], function () {
	return gulp.src('./test/**/*.js')
		.pipe(mocha())
		.pipe(istanbul.writeReports())
		.pipe(istanbul.enforceThresholds({thresholds: {global: 70}}));
});

gulp.task('dist', ['coverage'], function () {

});

gulp.task('dev-jshint', function() {
	return gulp.src(['./src/**/*.js', './test/**/*.js'])
			.pipe(jshint())
			.pipe(jshint.reporter('default'));
});

gulp.task('dev-test', ['dev-jshint'], function () {
	return gulp.src('./test/**/*.js')
			.pipe(mocha())
			.on('error', function (error) {
				console.log(error);
				this.emit('end');
			});
});

gulp.task('dev', function () {
	return gulp.watch(['./src/**/*.js', './test/**/*.js'], ['dev-test']);
});

gulp.task('ci', ['dist']);




