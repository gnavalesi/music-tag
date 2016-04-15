(function () {
	'use strict';

	var fs = require('fs'),
		Buffer = require('buffer').Buffer,
		Q = require('q');

	var write = function (path, tagBuffer, originalSize, savePath) {
		var deferred = Q.defer();

		if (!savePath) {
			savePath = path;
		}

		readFile(path, originalSize).then(function (buffer) {
			buffer = Buffer.concat([tagBuffer, buffer]);
			writeFile(savePath, buffer).then(function (result) {
				deferred.resolve(result);
			}).fail(deferred.reject);
		}).fail(deferred.reject);

		return deferred.promise;
	};

	var readFile = function (path, originalSize) {
		var deferred = Q.defer();

		fs.readFile(path, function (err, fileData) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(fileData.slice(originalSize));
			}
		});

		return deferred.promise;
	};

	var writeFile = function (savePath, buffer) {
		var deferred = Q.defer();

		fs.writeFile(savePath, buffer, function (err) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});

		return deferred.promise;
	};

	module.exports = {
		write: write
	};
})();