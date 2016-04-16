var _ = require('underscore'),
		fs = require('fs'),
		Buffer = require('buffer').Buffer,
		Q = require('q');


(function () {
	'use strict';

	var read = function (path) {
		var deferred = Q.defer();

		openFile(path).then(function (fileHandle) {
			readHeaderBuffer(fileHandle)
				.then(loadHeader)
				.then(_.partial(readTagBuffer, fileHandle))
				.then(function (tagBuffer) {
					closeFile(fileHandle).then(function () {
						deferred.resolve(tagBuffer);
					}).catch(deferred.reject);
				}).catch(deferred.reject);
		}).catch(deferred.reject);

		return deferred.promise;
	};

	var openFile = function (path) {
		var deferred = Q.defer();

		fs.open(path, 'r', function (err, fileHandle) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(fileHandle);
			}
		});

		return deferred.promise;
	};

	var readHeaderBuffer = function (fileHandle) {
		var deferred = Q.defer();
		var buffer = new Buffer(10);

		fs.read(fileHandle, buffer, 0, 10, 0, function (err) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(buffer);
			}
		});

		return deferred.promise;
	};

	var loadHeader = function (buffer) {
		var deferred = Q.defer();
		var header = buffer.slice(0, 10);

		if (header.slice(0, 3).toString() === 'ID3') {
			var dataSize = id3Size(header.slice(6, 10)) + 10;
			deferred.resolve(dataSize);
		} else {
			deferred.reject('NO_ID3');
		}

		return deferred.promise;
	};

	var readTagBuffer = function (fileHandle, tagSize) {
		var deferred = Q.defer();
		var tagBuffer = new Buffer(tagSize);

		fs.read(fileHandle, tagBuffer, 0, tagSize, 0, function (err) {
			if (err) {
				deferred.reject(new Error("Unable to read file"));
			} else {
				deferred.resolve(tagBuffer);
			}
		});

		return deferred.promise;
	};

	var closeFile = function (fileHandle) {
		var deferred = Q.defer();

		fs.close(fileHandle, function (err) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});

		return deferred.promise;
	};

	var id3Size = function (buffer) {
		return ((buffer[0] & 0x7F) << 21 ) |
			((buffer[1] & 0x7F) << 14) |
			((buffer[2] & 0x7F) << 7) |
			(buffer[3] & 0x7F);
	};

	module.exports = {
		read: read
	};
}());