var Q = require('q'),
	fs = require('fs'),
	_ = require('underscore'),
	readChunk = require('read-chunk'),
	isFlac = require('is-flac'),
	isMp3 = require('is-mp3'),
	isM4a = require('is-m4a'),
	isWav = require('is-wav'),
	isOgg = require('is-ogg');

var Utils = require('./utils');

var mp3 = require('./mp3');

(function () {
	'use strict';

	var defaultOptions = {
		recursive: true,
		replace: false,
		each: null
	};

	var write = function (path, tags, options) {
		var deferred = Q.defer();

		var validParameters = false;
		if (!_.isString(path)) {
			deferred.reject(new Error('Invalid path argument: ' + path));
		} else if (!_.isObject(tags)) {
			deferred.reject(new Error('Invalid tags argument: ' + tags));
		} else {
			var validatedOptions = Utils.validateOptions(options, defaultOptions);
			if (_.isNull(validatedOptions)) {
				deferred.reject(new Error('Invalid options argument: ' + options));
			} else {
				options = validatedOptions;
				validParameters = true;
			}
		}

		if (validParameters) {
			Q.all([Utils.validatePath(path), Utils.resolvePath(path)]).then(function (results) {
				var pathData = results[0];
				var fullPath = results[1];

				if (pathData.isFile()) {
					writeFile(fullPath, tags, options).then(function (writeResult) {
						deferred.resolve(writeResult);
					}).catch(deferred.reject);
				} else if (pathData.isDirectory()) {
					writeFolder(fullPath, tags, options).then(function (writeResults) {
						deferred.resolve(writeResults);
					}).catch(deferred.reject);
				} else {
					deferred.reject(new Error('Invalid path argument: ' + fullPath));
				}
			}).catch(deferred.reject);
		}

		return deferred.promise;
	};

	var writeFile = function (path, tags, options) {
		var buffer = readChunk.sync(path, 0, 12);

		if(isMp3(buffer)) {
			return mp3.write(path, tags, options);
		} else {
			var deferred = Q.defer();
			deferred.reject(new Error('non mp3'));
			return deferred.promise;
		}
	};

	var writeFolder = function (path, tags, options) {
		var deferred = Q.defer();

		Utils.getFiles(path, options.recursive).then(function (files) {
			var promises = _.map(files, function (file) {
				if (file.isFile()) {
					return writeFile(file.path, tags, options);
				} else {
					return writeFolder(file.path, tags, options);
				}
			});
			Q.all(promises).then(function (results) {
				deferred.resolve(_.flatten(results));
			}).catch(deferred.reject);
		}).catch(deferred.reject);

		return deferred.promise;
	};

	module.exports = {
		write: write
	};
}());

