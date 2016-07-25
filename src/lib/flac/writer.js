var Q = require('q'),
	fs = require('fs'),
	_ = require('underscore'),
	flac = require('flac-metadata');

var Utils = require('./../utils');

(function () {
	'use strict';

	var defaultOptions = {
		recursive: true,
		replace: false,
		each: null
	};

	var write = function (path, tags, options) {
		var deferred = Q.defer();

		var reader = fs.createReadStream(path);
		var writer = fs.createWriteStream(path + 'a');
		var processor = new flac.Processor();


		var vendor = 'reference libFLAC 1.2.1 20070917';
		var comments = generateTags(tags);
		var mdbVorbis = flac.data.MetaDataBlockVorbisComment.create(true, vendor, comments);

		processor.on('preprocess', function(mdb) {
			// Remove existing VORBIS_COMMENT block, if any
			if(mdb.type === flac.Processor.MDB_TYPE_VORBIS_COMMENT) {
				mdb.remove();

			}

			// Prepare to add new VORBIS_COMMENT block as last metadata block
			if(mdb.isLast) {
				mdb.isLast = false;

			}
		});

		processor.on('postprocess', function(mdb) {
			if(mdbVorbis) {
				// Add new VORBIS_COMMENT block as last metadata block
				this.push(mdbVorbis.publish());
			}
		});

		reader.pipe(processor).pipe(writer).end(function() {
			var result = new WriteResult(path, tags);
			deferred.resolve(result);
		});

		return deferred.promise;
	};

	var generateTags = function(tags) {
		return _.reduce(tags, function(acc, value, key) {
			acc.push(key.toUpperCase() + '=' + value);
			return acc;
		}, []);
	};

	var WriteResult = function (path, data) {
		return {
			path: path,
			data: data
		};
	};

	module.exports = {
		write: write
	};
}());

