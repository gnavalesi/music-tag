var assert = require('assert');
var musicTag = require('../src');
var _ = require('underscore');
var testsData = require('./test_data');
var should = require('should');

describe('music-tag', function () {
	describe('read', function () {
		it('should return a valid object when reading a valid file', function (done) {
			musicTag.read(testsData.test01.path, function (err, result) {
				if (err) {
					throw err;
				}

				result.path.should.match(testsData.test01.regex);
				result.data.should.deepEqual(testsData.test01.data);

				done();
			});
		});

		it('should return error when reading a non existing file', function(done) {
			musicTag.read(testsData.all + '/non_existent.mp3', function(err) {
				assert(err !== null);
				done();
			});
		});

		it('should return error when reading an invalid file', function(done) {
			musicTag.read(testsData.all + '/another_file02.ext', function(err) {
				assert(err !== null);
				done();
			});
		});

		it('should return error when reading no id3 tagged file', function(done) {
			musicTag.read(testsData.all + '/bad_file.mp3', function(err) {
				assert(err !== null);
				done();
			});
		});

		it('should return the right number of valid objects when reading a valid folder', function (done) {
			musicTag.read(testsData.directory01.path, function (err, withoutSlashResult) {
				if (err) {
					throw err;
				}

				withoutSlashResult.should.be.Array();
				withoutSlashResult.length.should.be.equal(2);

				for(var i = 0; i < 2; i ++) {
					var testData = testsData['test0' + (i + 3)];
					withoutSlashResult[i].path.should.match(testData.regex);
					withoutSlashResult[i].data.should.deepEqual(testData.data);
				}

				musicTag.read(testsData.directory01.path + '/', function (err, withSlashResult) {
					if (err) {
						throw err;
					}

					withSlashResult.should.deepEqual(withoutSlashResult);

					done();
				});
			});
		});

		it('should return the right number of valid objects when reading non recursive a valid folder', function (done) {
			musicTag.read(testsData.directory01.path, function (err, withoutSlashResult) {
				if (err) {
					throw err;
				}

				withoutSlashResult.should.be.Array();
				withoutSlashResult.length.should.be.equal(2);

				for(var i = 0; i < 2; i ++) {
					var testData = testsData['test0' + (i + 3)];
					withoutSlashResult[i].path.should.match(testData.regex);
					withoutSlashResult[i].data.should.deepEqual(testData.data);
				}

				musicTag.read(testsData.directory01.path + '/', function (err, withSlashResult) {
					if (err) {
						throw err;
					}

					withSlashResult.should.deepEqual(withoutSlashResult);

					done();
				});
			});
		});

		it('should return error when reading a non existing folder', function(done) {
			musicTag.read(testsData.all + '/non_existent', function(err) {
				assert(err !== null);
				done();
			});
		});

		it('should return error when an invalid path argument is passed', function(done) {
			musicTag.read(0, function(err) {
				assert(err !== null);
				done();
			});
		});
	});
});