(function() {
	'use strict';

	var _ = require('underscore'),
			fs = require('fs'),
			async = require('async'),
			Buffer = require('buffer').Buffer;

	var write = function (params, callback) {
		var data = {
			file_handle: null,
			path: params.path,
			original_tag_size: params.original_size,
			tags: params.tag_buffer,
			buffer: null,
			save_path: null
		};

		if(!_.isUndefined(params.save_path)) {
			data.save_path = params.save_path;
		}

		var actions = buildActions(data);

		actions.unshift(function (callback) {
			return callback(null, data);
		});

		async.waterfall(actions, function (err, data) {
			if (!_.isNull(err)) {
				return callback('Unable to process file: ' + err);
			}

			if (Buffer.isBuffer(data.path) && _.isNull(data.save_path)) {
				return callback(null, data.buffer);
			}

			return callback(null, data.tag_content);
		});
	};

	var buildActions = function (data) {
		var actions = [
			extractMusicBuffer,
			replaceTags
		];

		if (Buffer.isBuffer(data.path)) {
			data.buffer = data.path;

			if (!_.isNull(data.save_path)) {
				actions.push(writeFile);
			}
		} else {
			actions = _.union([fileExists, readFile], actions, [writeFile]);
		}

		return actions;
	};

	var fileExists = function(data, callback) {
		if (!_.isString(data.path)) {
			return callback("File does not exist");
		}

		fs.exists(data.path, function (exists) {
			if (!exists) {
				return callback('File does not exist');
			}

			return callback(null, data);
		});
	};

	var readFile = function (data, callback) {
		fs.readFile(data.path, function (err, file_data) {
			if (err) {
				return callback("Unable to open file");
			}

			data.buffer = file_data.slice(data.original_tag_size);
			return callback(null, data);
		});
	};

	var writeFile = function (data, callback) {
		var output_path = (!_.isNull(data.save_path) ? data.save_path : data.path);

		fs.writeFile(output_path, data.buffer, function (err) {
			if (err) {
				return callback('unable to write file');
			}

			return callback(null, data);
		});
	};

	var replaceTags = function (data, callback) {
		data.buffer = Buffer.concat([data.tags, data.buffer]);

		return callback(null, data);
	};

	var extractMusicBuffer = function (data, callback) {
		data.buffer = data.buffer.slice(data.original_tag_size);

		return callback(null, data);
	};

	module.exports = {
		write: write
	};
})();