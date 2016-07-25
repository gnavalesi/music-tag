var _ = require('underscore'),
	Q = require('q'),
	flac = require('flac-metadata'),
	fs = require('fs'),
	metadata = require('musicmetadata');


(function () {
	'use strict';

	var regex = /^([^=]+)=(.+)$/gm;

	var read = function(path, options) {
		var deferred = Q.defer();

		var reader = fs.createReadStream(path);
		var processor = new flac.Processor({ parseMetaDataBlocks: true });

		var data = [];
		processor.on('postprocess', function(mdb) {
			data.push(mdb);
		});

		processor.on('drain', function() {
			deferred.resolve(new ReadResult(path, parseData(data)));
		});

		reader.pipe(processor);

		return deferred.promise;
	};

	var parseData = function(datas) {
		var result = {};

		_.each(datas, function(data) {
			if(data.type === 4) {
				_.each(data.comments, function(comment) {
					var m;

					while ((m = regex.exec(comment)) !== null) {
						result[m[1].toLowerCase()] = m[2];
					}
				});
			}
		});

		return result;
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

