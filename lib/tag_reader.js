(function () {
	var _ = require('underscore'),
		fs = require('fs'),
		async = require('async'),
		Buffer = require('buffer').Buffer;

	function TagReader() {
		return this;
	}

	TagReader.prototype.read = function (params, callback) {
		var data = this.buildActions(params, {
			buffer: null,
			path: null,
			file_handle: null,
			tag_size: null,
			tag_content: null,
			actions: []
		});

		data.actions.unshift(function (callback) {
			return callback(null, data);
		});

		async.waterfall(data.actions, function (err, data) {
			if (!_.isNull(err)) {
				return callback('Unable to process file: ' + err);
			}

			return callback(null, data.tag_content);
		});
	};

	TagReader.prototype.buildActions = function (params, data) {
		if (Buffer.isBuffer(params)) {
			data.buffer = params;
			data.actions = [
				loadHeader,
				loadTagBuffer
			];
		} else {
			// read the buffer from a file
			data.path = params;
			data.actions = [
				fileExists,
				openFile,
				readHeaderBuffer,
				loadHeader,
				readTagBuffer,
				loadTagBuffer,
				closeFile
			];
		}

		return data;
	};

	var fileExists = function (d, cb) {
		if (!_.isString(d.path)) {
			return cb("File does not exist");
		}

		fs.exists(d.path, function (exists) {

			if (!exists) {
				return cb('File does not exist');
			}

			return cb(null, d);
		});
	};


// loads the details about the tag size etc
	var loadHeader = function (data, callback) {
		var header = data.buffer.slice(0, 10);

		if (header.slice(0, 3).toString() !== 'ID3') {
			return callback("No ID3 tags");
		}
		data.tag_size = id3Size(header.slice(6, 10));

		data.tag_content = {
			version: '2.' + header.readUInt8(3) + '.' + header.readUInt8(4)
		};

		return callback(null, data);
	};

	var loadTagBuffer = function (data, callback) {
		data.tag_content.tags = data.buffer.slice(0, data.tag_size);

		return callback(null, data);
	};

	var openFile = function (data, callback) {
		fs.open(data.path, 'r', function (err, file_handle) {
			if (err) {
				return callback("Unable to open file");
			}

			data.file_handle = file_handle;

			return callback(null, data);
		})
	};

	var closeFile = function (data, callback) {
		fs.close(data.file_handle, function (err) {
			if (err) {
				return callback("Unable to close file");
			}

			return callback(null, data);
		});
	};

	var readHeaderBuffer = function (data, callback) {
		var header_buffer = new Buffer(10);

		fs.read(data.file_handle, header_buffer, 0, 10, 0, function (err) {
			if (err) {
				return callback("Unable to read file");
			}

			data.buffer = header_buffer;
			return callback(null, data);
		});
	};

	var readTagBuffer = function (data, callback) {
		var tag_buffer = new Buffer(data.tag_size);

		fs.read(data.file_handle, tag_buffer, 0, data.tag_size, 0, function (err) {
			if (err) {
				return callback("Unable to read file");
			}

			data.buffer = tag_buffer;
			return callback(null, data);
		});
	};

// get the size of the tag
	var id3Size = function (buffer) {
		return ((buffer[0] & 0x7F) << 21 ) |
			((buffer[1] & 0x7F) << 14) |
			((buffer[2] & 0x7F) << 7) |
			(buffer[3] & 0x7F);
	};

	module.exports = new TagReader();
})();