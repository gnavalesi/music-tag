var _ = require('underscore'),
	Q = require('q'),
	flacmetadata = require('flac-metadata'),
	fs = require('fs');


(function () {
	'use strict';

	var read = function(path, options) {
		var deferred = Q.defer();

		var reader = fs.createReadStream(path);
		var processor = new flacmetadata.Processor({ parseMetaDataBlocks: true });

		var data = [];
		processor.on('postprocess', function(mdb) {
			data.push(mdb);
			if(data.length === 3) {
				deferred.resolve(data);
			}
		});

		reader.pipe(processor);

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

