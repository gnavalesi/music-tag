var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	istanbul = require('gulp-istanbul'),
	mocha = require('gulp-mocha'),
	clean = require('gulp-clean'),
	watch = require('gulp-watch'),
	batch = require('gulp-batch');

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

gulp.task('test', ['coverage'], function () {
	return gulp.src('./test/**/*.js')
		.pipe(mocha())
		.pipe(istanbul.writeReports())
		.pipe(istanbul.enforceThresholds({thresholds: {global: 30}}));
});

gulp.task('dev', ['build'], function() {
	watch(['./src/**/*.js', './test/**/*.js'], batch(function(events, done) {
		gulp.start('test', done);
	}));

	//return gulp.src(['./src/**/*.js', './test/**/*.js'])
	//		.pipe()
	//		.on('end', cb);
});

gulp.task('dist', ['test'], function () {

});





