(function() {
	function Utils() {
		return this;
	}

	Utils.prototype.isMusicFile = function(filepath) {
		if(typeof filepath !== 'string') {
			throw new Error('filepath supplied is not a string');
		}

		var regex = /.+.(mp3|flac|wav)/i;

		return filepath.toString().match(regex) !== null;
	};

	var utils = new Utils();

	module.exports = {
		isMusicFile: utils.isMusicFile
	};
})();

