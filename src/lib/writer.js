var Q = require('q'),
	fs = require('fs'),
	_ = require('underscore');

var Utils = require('./utils');

var TagReader = require('./tag_reader');
var TagExtractor = require('./tag_extractor');
var TagWriter = require('./tag_writer');
var TagGenerator = require('./tag_generator');

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

				if (pathData.isFile && Utils.isMusicFile(fullPath)) {
					writeFile(fullPath, tags, options).then(function (writeResult) {
						deferred.resolve(writeResult);
					}).catch(deferred.reject);
				} else if (pathData.isDirectory) {
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
		var deferred = Q.defer();

		var readDeferred = Q.defer();

		TagReader.read(path).then(function (buffer) {
			if (!options.replace) {
				tags = _.extend(TagExtractor.extract(buffer), tags);
			}
			readDeferred.resolve({
				tags: tags,
				originalSize: buffer.length
			});
		}).catch(function (err) {
			if (err === 'NO_ID3') {
				readDeferred.resolve({
					tags: tags,
					originalSize: 0
				});
			} else {
				readDeferred.reject(err);
			}
		});

		readDeferred.promise.then(function (readResult) {
			var tagBuffer = TagGenerator.generate(readResult.tags);

			TagWriter.write(path, tagBuffer, readResult.originalSize).then(function () {
				var writeResult = WriteResult(path, readResult.tags);
				if(!_.isNull(options.each)) {
					options.each(writeResult);
				}
				deferred.resolve(writeResult);
			}).catch(deferred.reject);
		}).catch(deferred.reject);

		return deferred.promise;
	};

	var writeFolder = function (path, tags, options) {
		var deferred = Q.defer();

		Utils.getFiles(path, options.recursive).then(function (files) {
			var promises = _.map(files, function (file) {
				if (file.isFile) {
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

	var WriteResult = function (path, data) {
		return {
			path: path,
			data: data
		};
	};

	module.exports = {
		write: write
	};
}());

