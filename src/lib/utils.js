(function () {
	'use strict';

	var fs = require('fs');
	var Q = require('q');

	var validatePath = function(path) {
		var deferred = Q.defer();

		fs.stat(path, function (err, stats) {
			if (err) {
				deferred.reject(err);
			} else {
				var data = {
					isDirectory: stats.isDirectory(),
					isFile: stats.isFile()
				};

				deferred.resolve(data);
			}
		});

		return deferred.promise;
	};

	/*
	var validatePath = function (options) {
		var deferred = Q.defer();

		fs.stat(options.path.path, function (err, stats) {
			if (err) {
				deferred.reject(new Error(err));
			} else {
				options.path.isDirectory = stats.isDirectory();
				options.path.isFile = stats.isFile();

				deferred.resolve(options);
			}
		});

		return deferred.promise;
	};
	*/

	var resolvePath = function (path) {
		var deferred = Q.defer();

		fs.realpath(path, function (err, resolvedPath) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(resolvedPath);
			}
		});

		return deferred.promise;
	};

	/*
	var resolvePath = function (options) {
		var deferred = Q.defer();

		fs.realpath(options.path.path, function (err, resolvedPath) {
			if (err) {
				deferred.reject(new Error(err));
			} else {
				options.path.fullPath = resolvedPath;
				deferred.resolve(options);
			}
		});

		return deferred.promise;
	};
	*/

	var isMusicFile = function(path) {
		var regex = /.+.(mp3|flac|wav)/i;
		return path.toString().match(regex) !== null;
	};

	module.exports = {
		validatePath: validatePath,
		resolvePath: resolvePath,
		isMusicFile: isMusicFile
	};
})();