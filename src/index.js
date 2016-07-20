var reader = require('./lib/reader');
var writer = require('./lib/mp3/writer');

(function () {
	'use strict';

	module.exports = {
		read: reader.read,
		write: writer.write
	};
}());