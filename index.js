var musicTag = require('./src');
var testsData = require('./test/test_data');

module.exports = musicTag;

var options = {
	replace: true
};

musicTag.write(testsData.files.bad_file.path, {}, options).then(function (result) {

}).catch(function(e) {
	console.error(e);
});