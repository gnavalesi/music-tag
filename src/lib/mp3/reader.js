var _ = require('underscore'),
	Q = require('q');

var TagReader = require('./tag_reader'),
	TagExtractor = require('./tag_extractor');

(function () {
	'use strict';

	var read = function(path, options) {
		var deferred = Q.defer();
		TagReader.read(path).then(function (tag_buffer) {
			var tags = TagExtractor.extract(tag_buffer);
			var result = ReadResult(path, tags);

			if(!_.isNull(options.each)) {
				options.each(result);
			}

			deferred.resolve(result);
		}).catch(function (err) {
			if (err === 'NO_ID3') {
				var result = ReadResult(path, {});

				if(!_.isNull(options.each)) {
					options.each(result);
				}

				deferred.resolve(result);
			} else {
				deferred.reject(new Error(err));
			}
		});

		return deferred.promise;
	};

	var ReadResult = function (path, data) {
		return {
			path: path,
			data: data
		};
	};

	module.exports = {
		read: read
	};
}());

