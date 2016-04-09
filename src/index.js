(function() {
	var reader = require('./lib/reader');
	var writer = require('./lib/writer');

	module.exports = {
		read: reader.read,
		write: writer.write
	}
})();



