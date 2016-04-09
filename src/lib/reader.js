(function () {
	'use strict';

	var id3 = require('./id3');
	var fs = require('fs');
	var _ = require('underscore');
	var async = require('async');
	var q = require('q');

	var TagReader = require('./tag_reader'),
		TagExtractor = require('./tag_extractor');

	var defaultOptions = {
		recursive: true,
		each: null
	};

	var read = function (path, options, callback) {
		var ops = options;
		if (_.isFunction(options)) {
			callback = options;
			ops = {};
		}

		ops = _.extend(defaultOptions, ops);

		if (_.isString(path)) {
			return readString(path, ops, callback);
		} else {
			return callback('Invalid path argument: ' + path);
		}
	};

	var readString = function (path, options, callback) {
		return validatePath(path, function (err, data) {
			if (err) {
				return callback('Invalid path: ' + path + '\n\t' + err);
			}

			return readPath(data, options, callback);
		});
	};

	var readPath = function(data, options, callback) {
		if (data.isDirectory) {
			return readFolder(data.path, options, callback);
		} else if (data.isFile) {
			return readFile(data.path, options, callback);
		} else {
			return callback('Unable to recognize path: ' + data.path);
		}
	};

	var readFile = function (path, options, callback) {
		TagReader.read(path, function (err, tag_buffer) {
			if (err) {
				return callback(err);
			}

			var tags = TagExtractor.extract(tag_buffer);

			return callback(null, ReadResult(path, tags));
		});
	};

	var readFolder = function (path, options, callback) {
		getFiles(path, function (err, files) {
			if (err) {
				return callback('Unable to get files from folder ' + path + ': ' + err);
			}

			return async.map(_.filter(files, function (file) {
				return isMusicFile(file) || isDirectory(file);
			}), _.partial(readString, _, options), function (err, results) {
				if (err) {
					return callback(err);
				}

				return callback(null, _.flatten(results));
			});
		});
	};

	var validatePath = function (path, callback) {
		return fs.stat(path, function (err, stats) {
			if (err) {
				return callback('Unable to read path ' + path + ':\n\t' + err);
			}

			return resolvePath(path, function (err, resolvedPath) {
				if (err) {
					return callback(err);
				}

				return callback(null, {
					path: resolvedPath,
					isDirectory: stats.isDirectory(),
					isFile: stats.isFile()
				});
			});
		});
	};

	var resolvePath = function (path, callback) {
		return fs.realpath(path, function (err, resolvedPath) {
			if (err) {
				return callback('Unable to resolve real path of path ' + path + ':\n\t' + err);
			}

			return callback(null, resolvedPath);
		});
	};

	var getFiles = function (folder, callback) {
		fs.readdir(folder, function (err, files) {
			if (err) {
				return callback('Unable to get files from folder ' + folder + ': ' + err);
			}

			return async.map(_.map(files, _.partial(addPath, folder)), resolvePath, callback);
		});
	};

	var addPath = function (path, file) {
		return normalizePath(path) + file;
	};

	var normalizePath = function (path) {
		return (path.endsWith('/') ? path : path + '/');
	};

	var isMusicFile = function (filepath) {
		var regex = /.+.(mp3|flac|wav)/i;
		return filepath.toString().match(regex) !== null;
	};

	var isDirectory = function (path) {
		return path.toString().endsWith('/') || path.toString().match(/^.+\/[^\.]+$/) !== null;
	};

	function ReadResult(path, data) {
		return {
			path: path,
			data: data
		};
	}

	module.exports = {
		read: read
	};
})();

