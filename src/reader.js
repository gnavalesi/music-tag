/*jslint sub: true*/

(function () {
	var id3 = require('./id3');
	var fs = require('fs');
	var _ = require('underscore');
	var async = require('async');
	var glob = require('glob');

	var read = function(path, callback) {
		if(_.isString(path)) {
			return readString(path, callback);
		} else if(_.isArray(path)) {
			return readArray(path, callback);
		} else {
			return callback('Invalid path argument: ' + path);
		}
	};

	var readString = function(path, callback) {
		return validatePath(path, function(err, data) {
			if(err) {
				return callback('Invalid path: ' + path + '\n\t' + err);
			}

			if(data.isDirectory) {
				return readFolder(_.omit(data, ['isDirectory', 'isFile']), callback);
			} else if(data.isFile) {
				return readFile(_.omit(data, ['isDirectory', 'isFile']), callback);
			} else {
				return callback('Unable to recognize path: ' + path);
			}
		});
	};

	var readArray = function(array, callback) {
		async.map(array, readString, function(err, results) {
			if(err) {
				return callback(err);
			}

			return callback(null, _.reduce(results, function(acc, result) {
				return _.extend(acc, result);
			}, {}));
		});
	};

	var readFile = function (path, callback) {
		return id3.read(path.fullPath, function(err, tags) {
			if(err) {
				return callback(err);
			}

			return callback(null, _.object([path.fullPath], [tags]));
		});
	};

	var readFolder = function (path, callback) {
		getFiles(path.fullPath, function (err, files) {
			if (err) {
				return callback('Unable to get files from folder ' + path.fullPath + ': ' + err);
			}

			var groups = _.groupBy(files, function(file) {
				if(isMusicFile(file.path)) {
					return 'music';
				} else if(isDirectory(file.path)) {
					return 'directory';
				} else {
					return 'none';
				}
			});

			return async.parallel([_.partial(readFiles, groups['music']),
					_.partial(readFolders, groups['directory'])], function(err, results) {
				if(err) {
					return callback(err);
				}

				return callback(null, _.reduce(_.flatten(results), function(acc, result) {
					return _.extend(acc, result);
				}, {}));
			});
		});
	};

	var validatePath = function(path, callback) {
		return fs.stat(path, function(err, stats) {
			if(err) {
				return callback('Unable to read path ' + path + ':\n\t' + err);
			}

			return resolvePath(path, function(err, resolvedPath) {
				if(err) {
					return callback(err);
				}

				return callback(null, _.extend(resolvedPath, {
					isDirectory: stats.isDirectory(),
					isFile: stats.isFile()
				}));
			});
		});
	};

	var resolvePath = function(path, callback) {
		return fs.realpath(path, function(err, resolvedPath) {
			if(err) {
				return callback('Unable to resolve real path of path ' + path + ':\n\t' + err);
			}

			return callback(null, {
				path: path,
				fullPath: resolvedPath
			});
		});
	};

	var readFiles = function (files, callback) {
		async.map(files, readFile, function (err, results) {
			if (err) {
				return callback('Unable to process file:\n\t' + err);
			}

			return callback(null, _.reduce(results, function(acc, result) {
				return _.extend(acc, result);
			}, {}));
		});
	};

	var readFolders = function(folders, callback) {
		async.map(folders, readFolder, function (err, results) {
			if (err) {
				return callback('Unable to process file:\n\t' + err);
			}

			return callback(null, _.flatten(results));
		});
	};

	var getFiles = function(folder, callback) {
		fs.readdir(folder, function (err, files) {
			if (err) {
				return callback('Unable to get files from folder ' + folder + ': ' + err);
			}

			return async.map(_.map(files, _.partial(addPath, folder)), resolvePath, callback);
		});
	};

	var addPath = function(path, file) {
		return normalizePath(path) + file;
	};

	var normalizePath = function (path) {
		return (path.endsWith('/') ? path : path + '/');
	};

	var isMusicFile = function (filepath) {
		if (typeof filepath !== 'string') {
			throw new Error('filepath supplied is not a string');
		}

		var regex = /.+.(mp3|flac|wav)/i;

		return filepath.toString().match(regex) !== null;
	};

	var isDirectory = function(path) {
		return path.toString().endsWith('/') || path.toString().match(/^.+\/[^\.]+$/) !== null;
	};

	module.exports = {
		read: read
	};
})();

