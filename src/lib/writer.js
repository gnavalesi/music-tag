(function () {
	'use strict';

	var Q = require('q');
	var fs = require('fs');
	var _ = require('underscore');

	var Utils = require('./utils');
	var reader = require('./reader');

	var TagReader = require('./tag_reader');
	var TagExtractor = require('./tag_extractor');
	var TagWriter = require('./tag_writer');
	var TagGenerator = require('./tag_generator');

	var defaultOptions = {
		recursive: true,
		replace: false
	};

	var write = function(path, tags) {
		var options = _.clone(defaultOptions);

		if(!_.isObject(tags)) {
			var deferred = Q.defer();
			deferred.reject('Invalid tags argument');
			return deferred.promise;
		}

		if (_.isString(path)) {
			options.path = {
				path: path
			};
		} else if (_.isObject(path)) {
			options = _.extend(options, _.omit(path, 'path'));
			options.path = {
				path: path.path
			};
		}
		options.newTags = tags;

		var actions = [Utils.validatePath, Utils.resolvePath, writePath];

		return _.reduce(actions, Q.when, Q(options));
	};

	var writePath = function(options) {
		if(options.path.isDirectory) {
			return writeFolder(options);
		} else if(options.path.isFile) {
			if(Utils.isMusicFile(options.path.fullPath)) {
				return writeFile(options);
			} else {
				throw new Error('Unable to recognize path: ' + options.path);
			}
		} else {
			throw new Error('Unable to recognize path: ' + options.path);
		}
	};

	var writeFile = function(options) {
		var actions = [read, generate, doWrite];

		return _.reduce(actions, Q.when, Q(options));
	};

	var writeFolder = function(options) {
		return options;
	};

	var WriteResult = function(path, data) {
		return {
			path: path,
			data: data
		};
	};

	var read = function(options) {
		var deferred = Q.defer();

		TagReader.read(options.path.fullPath).then(function(tag_buffer) {
			if(options.replace) {
				options.tags = options.newTags;
			} else {
				options.tags = _.extend(TagExtractor.extract(tag_buffer.tags, tag_buffer.version), options.newTags);
			}
			options.original_size = tag_buffer.tags.length;

			deferred.resolve(options);
		}).fail(function(err) {
			if (err === 'NO_ID3') {
				options.tags = options.newTags;
				options.original_size = 0;

				deferred.resolve(options);
			} else {
				deferred.reject(new Error(err));
			}
		});

		return deferred.promise;
	};

	var generate = function(options) {
		var deferred = Q.defer();

		options.tag_buffer = TagGenerator.generate(options.tags);
		deferred.resolve(options);

		return deferred.promise;
	};

	var doWrite = function(options) {
		var deferred = Q.defer();

		var ops = {
			original_size: options.original_size,
			path: options.path.fullPath,
			tag_buffer: options.tag_buffer
		};

		TagWriter.write(ops, function(err, data) {
			if (!_.isNull(err)) {
				deferred.reject(err);
			} else {
				deferred.resolve(WriteResult(options.path.fullPath, data));
			}
		});

		return deferred.promise;
	};

	module.exports = {
		write: write
	};
})();

