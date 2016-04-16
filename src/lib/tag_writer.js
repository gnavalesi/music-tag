var fs = require('fs'),
		Buffer = require('buffer').Buffer,
		Q = require('q');


(function () {
	'use strict';

	var write = function (path, tagBuffer, originalSize) {
		var deferred = Q.defer();

		readFile(path, originalSize).then(function (buffer) {
			buffer = Buffer.concat([tagBuffer, buffer]);
			writeFile(path, buffer).then(function (result) {
				deferred.resolve(result);
			}).catch(deferred.reject);
		}).catch(deferred.reject);

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

	var writeFile = function (path, buffer) {
		var deferred = Q.defer();

		fs.writeFile(path, buffer, function (err) {
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
}());