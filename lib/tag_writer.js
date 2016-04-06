var _ = require('underscore'),
	fs = require('fs'),
	async = require('async'),
	Buffer = require('buffer').Buffer;

function TagWriter() {
	return this;
}

TagWriter.prototype.write = function (params, callback) {
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
			return callback('Unable to process file');
		}

		if (Buffer.isBuffer(data.path) && _.isNull(data.save_path)) {
			return callback(null, data.buffer);
		}

		return callback(null, data.tag_content);
	});
};

var buildActions = function (data) {
	var actions = [];

	if (Buffer.isBuffer(data.path)) {
		data.buffer = data.path;

		actions = [
			extractMusicBuffer,
			replaceTags
		];

		if (!_.isNull(data.save_path)) {
			actions.push(writeFile);
		}
	} else {
		actions = [
			readFile,
			extractMusicBuffer,
			replaceTags,
			writeFile
		];

		actions.unshift(function (d, cb) {
			if (!_.isString(d.path)) {
				return cb("File does not exist");
			}

			fs.exists(d.path, function (exists) {
				if (!exists) {
					return cb('File does not exist');
				}

				return cb(null, d);
			});
		});
	}

	return actions;
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

module.exports = new TagWriter();