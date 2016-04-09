(function () {
	'use strict';

	var fs = require('fs');
	var Q = require('q');

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

	module.exports = {
		validatePath: validatePath,
		resolvePath: resolvePath
	};
})();