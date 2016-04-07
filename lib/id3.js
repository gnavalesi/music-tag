(function() {
	var _       = require('underscore'),
		async   = require('async');

	var TagReader     = require('./tag_reader'),
		TagExtractor  = require('./tag_extractor'),
		TagGenerator = require('./tag_generator'),
		TagWriter     = require('./tag_writer');

	var read = function(file, callback) {
		TagReader.read(file, function(err, tag_buffer) {
			if (err) {
				return callback(err);
			}

			var tags = TagExtractor.extract(tag_buffer);

			return callback(null, tags);
		});
	};

	var write = function(params, callback) {
		var actions = [];

		actions.push(function(cb) {
			TagReader.read(params.path, function(err, tag_buffer) {
				if (err) {
					return cb(err);
				}

				params.original_size = tag_buffer.tags.length;
				return cb(null, tag_buffer);
			});
		});

		actions.push(function(tag_buffer, cb) {
			var tags = TagExtractor.extract(tag_buffer);

			// add in the new tags to our existing tags
			_.extend(tags, params.tags);

			// swap the tags about
			params.tags = tags;
			return cb(null);
		});

		actions.push(function(cb) {
			TagGenerator.generate(params, function(err, data) {

				if (!_.isNull(err)) {
					return cb(err);
				}

				params.tag_buffer = data;
				return cb(null);
			});
		});

		actions.push(function(cb) {
			TagWriter.write(params, function(err, data) {
				if (!_.isNull(err)) {
					return cb(err);
				}

				return cb(null, data);
			})
		});

		async.waterfall(actions, function(err, data) {
			if (!_.isNull(err)) {
				return callback(err);
			}

			return callback(null, data);
		});

	};

	module.exports = {
		read: read,
		write: write
	};
})();