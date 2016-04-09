var assert = require('assert');
var musicTag = require('../src');
var _ = require('underscore');

var testData = {
	test01 : {
		path: 'test/resources/test01.mp3',
		regex: /test\/resources\/test01\.mp3$/,
		data: {
			artist: 'Artist 01',
			title: 'Title 01',
			album: 'Album 01',
			genre: '(13)',
			year: '1999',
			version: '2.3.0'
		}
	},
	test02 : {
		path: 'test/resources/test02.mp3',
		regex: /test\/resources\/test02\.mp3$/,
		data: {
			artist: 'Artist 02',
			title: 'Title 02',
			album: 'Album 02',
			genre: '(13)',
			year: '1999',
			version: '2.3.0'
		}
	},
	test03: {
		path: 'test/resources/directory01/test03.mp3',
		regex: /test\/resources\/directory01\/test03\.mp3$/,
		data: {
			artist: 'Artist 03',
			title: 'Title 03',
			album: 'Album 03',
			genre: '(13)',
			year: '1999',
			version: '2.3.0'
		}
	},
	test04: {
		path: 'test/resources/directory01/test04.mp3',
		regex: /test\/resources\/directory01\/test04\.mp3$/,
		data: {
			artist: 'Artist 04',
			title: 'Title 04',
			album: 'Album 04',
			genre: '(13)',
			year: '1999',
			version: '2.3.0'
		}
	},
	test05: {
		path: 'test/resources/directory02/test05.mp3',
		regex: /test\/resources\/directory02\/test05\.mp3$/,
		data: {
			artist: 'Artist 05',
			title: 'Title 05',
			album: 'Album 05',
			genre: '(13)',
			year: '1999',
			version: '2.3.0'
		}
	},
	test06: {
		path: 'test/resources/directory02/test06.mp3',
		regex: /test\/resources\/directory02\/test06\.mp3$/,
		data: {
			artist: 'Artist 06',
			title: 'Title 06',
			album: 'Album 06',
			genre: '(13)',
			year: '1999',
			version: '2.3.0'
		}
	},
	all: {
		path: 'test/resources'
	},
	directory01: {
		path: 'test/resources/directory01'
	},
	directory02: {
		path: 'test/resources/directory02'
	}
};

describe('music-tag', function () {
	describe('read', function () {
		it('should return a valid object when reading a valid file', function (done) {
			musicTag.read(testData.test01.path, function (err, data) {
				if (err) {
					throw err;
				}

				var key = _.first(_.keys(data));
				assert(testData.test01.regex.exec(key) !== null);
				assert.deepEqual(data[key], testData.test01.data);

				done();
			});
		});

		it('should return the right number of valid objects when reading a valid folder', function (done) {
			musicTag.read(testData.directory01.path, function (err, data) {
				if (err) {
					throw err;
				}

				var keys = _.keys(data);
				assert(testData.test03.regex.exec(keys[0]) !== null);
				assert.deepEqual(data[keys[0]], testData.test03.data);

				assert(testData.test04.regex.exec(keys[1]) !== null);
				assert.deepEqual(data[keys[1]], testData.test04.data);

				done();
			});
		});

		it('should return the right number of valid objects when reading an array of valid files', function () {
			musicTag.read([testData.test01.path, testData.test01.path], function (err, data) {
				if (err) {
					throw err;
				}

				var keys = _.keys(data);
				assert(testData.test01.regex.exec(keys[0]) !== null);
				assert.deepEqual(data[keys[0]], testData.test01.data);

				assert(testData.test02.regex.exec(keys[1]) !== null);
				assert.deepEqual(data[keys[1]], testData.test02.data);

				done();
			});
		});

		it('should return the right number of valid objects when reading an array of valid folders', function () {
			throw "Not implemented";
		});

		it('should return the right number of valid objects when reading a folder and a file inside that folder', function () {
			throw "Not implemented";
		});

		it('should return the right number of valid objects when reading a folder and a folder inside that folder', function () {
			throw "Not implemented";
		});

		it('should return the right number of valid objects when reading an array of repeated files', function () {
			throw "Not implemented";
		});

		it('should return the right number of valid objects when reading an array of repeated folders', function () {
			throw "Not implemented";
		});
	});
});