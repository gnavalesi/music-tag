var fs = require('fs'),
	_ = require('underscore'),
	Q = require('q'),
	readChunk = require('read-chunk'),
	isFlac = require('is-flac'),
	isMp3 = require('is-mp3'),
	isM4a = require('is-m4a'),
	isWav = require('is-wav'),
	isOgg = require('is-ogg');

var mp3 = require('./mp3'),
	flac = require('./flac');


var Utils = require('./utils');

(function () {
	'use strict';

	var defaultOptions = {
		recursive: true,
		each: null
	};

	var read = function (path, options) {
		var deferred = Q.defer();

		var validParameters = false;
		if (!_.isString(path)) {
			deferred.reject(new Error('Invalid path argument: ' + path));
		} else {
			var validatedOptions = Utils.validateOptions(options, defaultOptions);
			if(_.isNull(validatedOptions)) {
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
					readFile(fullPath, options).then(function (readResult) {
						deferred.resolve(readResult);
					}).catch(deferred.reject);
				} else if (pathData.isDirectory()) {
					readFolder(fullPath, options).then(function (readResults) {
						deferred.resolve(readResults);
					}).catch(deferred.reject);
				} else {
					deferred.reject(new Error('Invalid path argument: ' + fullPath));
				}
			}).catch(deferred.reject);
		}

		return deferred.promise;
	};

	var readFile = function (path, options) {
		var buffer = readChunk.sync(path, 0, 12);

		if(isMp3(buffer)) {
			return mp3.read(path, options);
		} else if(isFlac(buffer)) {
			return flac.read(path, options);
		} else {
			var deferred = Q.defer();
			deferred.reject(new Error('non mp3'));
			return deferred.promise;
		}
	};

	var readFolder = function (path, options) {
		var deferred = Q.defer();

		Utils.getFiles(path, options.recursive).then(function (files) {
			var promises = _.map(files, function (file) {
				if (file.isFile()) {
					return readFile(file.path, options);
				} else {
					return readFolder(file.path, options);
				}
			});
			Q.all(promises).then(function (results) {
				deferred.resolve(_.flatten(results));
			}).catch(deferred.reject);
		}).catch(deferred.reject);

		return deferred.promise;
	};

	module.exports = {
		read: read
	};
}());

