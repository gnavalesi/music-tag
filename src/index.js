var reader = require('./lib/reader');
var writer = require('./lib/writer');

(function() {
	'use strict';

	module.exports = {
		read: reader.read,
		write: writer.write
	};
}());



