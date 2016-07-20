var reader = require('./reader');
var writer = require('./writer');

(function () {
	'use strict';

	module.exports = {
		read: reader.read,
		write: writer.write
	};
}());