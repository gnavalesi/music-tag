(function () {
	'use strict';

	var id3 = require('./id3');
	var Q = require('q');
	var fs = require('fs');

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
/*
	ID3Reader.prototype.readFolder = function (folder) {
		var self = this;
		var deferred = Q.defer();

		fs.readdir(folder, function (err, files) {
			if (err) {
				deferred.reject(err);
			} else {
				var promise = Q.all(
					_.chain(files)
						.filter(utils.isMusicFile)
						.map(function (file) {
							return self.readFile(folder + file);
						}).value());

				promise.then(function (data) {
					deferred.resolve(data);
				}, function (err) {
					deferred.reject(err);
				});
			}
		});

		return deferred.promise;
	};
*/

	module.exports = new ID3Reader();
})();

