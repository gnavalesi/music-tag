(function () {
	'use strict';

	var id3 = require('./id3');
	var Q = require('q');
	var fs = require('fs');
	var _ = require('underscore');

	var Utils = require('./utils');
	var reader = require('./reader');

	var defaultOptions = {
		recursive: true,
		replace: false
	};

	var write = function(path, tags) {
		var deferred = Q.defer();
		var options = _.clone(defaultOptions);
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

		reader.read(path).then(function(result) {
			if(_.isObject(result)) {

			} else if(_.isArray(result)) {

			}
		}).fail(function(err) {
			deferred.reject(err);
		});

		return deferred.promise;
	};

	var writePath = function(options) {
		if(options.path.isDirectory) {
			console.log('writing to folder');
			return writeFolder(options);
		} else if(options.path.isFile) {
			console.log('writing to file');
			return writeFile(options);
		} else {
			throw new Error('Unable to recognize path: ' + options.path);
		}
	};

	var writeFile = function(options) {
		if(!options.replace) {

		}
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





	function ID3Reader() {
		return this;
	}

	ID3Reader.prototype.writeFile = function (filepath, tags) {
		var deferred = Q.defer();

		id3.write({
			path: filepath,
			tags: tags
		}, function (err, data) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve({
					file: filepath,
					tags: data
				});
			}
		});

		return deferred.promise;
	};

	module.exports = {
		//new ID3Reader()
		write: write
	};
})();

