var assert = require('assert');
var musicTag = require('../src');
var _ = require('underscore');
var testsData = require('./test_data');
var should = require('should');
var fs = require('fs');

describe('music-tag', function () {
	beforeEach(function () {
		fs.writeFile(testsData.bad_file.path, '');
	});

	describe('read', function () {
		describe('file', function () {
			it('should return a valid object when reading a valid file', function (done) {
				musicTag.read(testsData.test01.path).then(function (result) {
					result.path.should.match(testsData.test01.regex);
					result.data.should.deepEqual(testsData.test01.data);
					done();
				}).fail(function (err) {
					done(err);
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return an empty result when reading no id3 tagged file', function (done) {
				musicTag.read(testsData.bad_file.path).then(function (result) {
					result.path.should.match(testsData.bad_file.regex);
					result.data.should.deepEqual(testsData.bad_file.data);
					done();
				}).fail(function (err) {
					done(err);
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return error when reading a non existing file', function (done) {
				musicTag.read(testsData.all.path + '/non_existent.mp3').then(function (result) {
					done(new Error('Value returned: ' + result));
				}).fail(function () {
					done();
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return error when reading an invalid file', function (done) {
				musicTag.read(testsData.all.path + '/another_file02.ext').then(function (result) {
					done(new Error('Value returned: ' + result));
				}).fail(function () {
					done();
				}).catch(function (err) {
					done(err);
				});
			});
		});

		describe('folder', function () {
			it('should return the right number of valid objects when reading a valid folder', function (done) {
				musicTag.read(testsData.all.path).then(function (withoutSlashResult) {
					withoutSlashResult.should.be.Array();
					withoutSlashResult.length.should.be.equal(7);

					withoutSlashResult[0].path.should.match(testsData.bad_file.regex);
					withoutSlashResult[0].data.should.deepEqual(testsData.bad_file.data);

					for (var i = 0; i < 6; i++) {
						var testData = testsData['test0' + (((i + 2) % 6) + 1)];
						withoutSlashResult[i + 1].path.should.match(testData.regex);
						withoutSlashResult[i + 1].data.should.deepEqual(testData.data);
					}

					musicTag.read(testsData.all.path + '/').then(function (withSlashResult) {
						withSlashResult.should.deepEqual(withoutSlashResult);
						done();
					}).fail(function (err) {
						done(err);
					});
				}).fail(function (err) {
					done(err);
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return the right number of valid objects when reading non recursive a valid folder', function (done) {
				musicTag.read({
					path: testsData.all.path,
					recursive: false
				}).then(function (withoutSlashResult) {
					withoutSlashResult.should.be.Array();
					withoutSlashResult.length.should.be.equal(3);

					withoutSlashResult[0].path.should.match(testsData.bad_file.regex);
					withoutSlashResult[0].data.should.deepEqual(testsData.bad_file.data);

					for (var i = 1; i < 3; i++) {
						var testData = testsData['test0' + i];
						withoutSlashResult[i].path.should.match(testData.regex);
						withoutSlashResult[i].data.should.deepEqual(testData.data);
					}

					done();
				}).fail(function (err) {
					done(err);
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return error when reading a non existing folder', function (done) {
				musicTag.read(testsData.all.path + '/non_existent').then(function () {
					assert(false);
					done();
				}).fail(function (err) {
					err.should.be.Error();
					done();
				});
			});
		});

		it('should return error when an invalid path argument is passed', function (done) {
			musicTag.read(0).then(function () {
				assert(false);
				done();
			}).fail(function (err) {
				err.should.be.Error();
				done();
			});
		});
	});

	describe('write', function () {
		describe('file', function () {
			it('should save correctly the tags when writing to a non id3 tagged file', function (done) {
				musicTag.write(testsData.bad_file.path, testsData.test01.data).then(function (result) {
					result.path.should.match(testsData.bad_file.regex);

					musicTag.read(testsData.bad_file.path).then(function (readResult) {
						readResult.data.should.deepEqual(testsData.test01.data);
						done();
					}).fail(function (err) {
						done(err);
					}).catch(function (err) {
						done(err);
					});
				}).fail(function (err) {
					done(err);
				}).catch(function (err) {
					done(err);
				});
			});

			it('should save correctly the tags when writing to a valid file', function (done) {
					musicTag.write(testsData.bad_file.path, testsData.test02.data).then(function (result) {
						result.path.should.match(testsData.bad_file.regex);

						musicTag.read(testsData.bad_file.path).then(function (readResult) {
							readResult.data.should.deepEqual(testsData.test02.data);
							done();
						}).fail(function (err) {
							done(err);
						}).catch(function (err) {
							done(err);
						});
					}).fail(function (err) {
						done(err);
					}).catch(function (err) {
						done(err);
					});
				}
			);

			it('should return error when writing to a non existing file', function (done) {
					musicTag.write(testsData.all.path + '/non_existent.mp3', testsData.test01.data).then(function (result) {
						done(new Error('Value returned: ' + result));
					}).fail(function () {
						done();
					}).catch(function (err) {
						done(err);
					});
				}
			);

			it('should return error when writing to an invalid file', function (done) {
					musicTag.write(testsData.all.path + '/another_file02.ext', testsData.test01.data).then(function (result) {
						done(new Error('Value returned: ' + _.pairs(result)));
					}).fail(function () {
						done();
					}).catch(function (err) {
						done(err);
					});
				}
			);
		});

		describe('folder', function () {
			it('should save correctly the tags when writing to a valid folder'
				//		, function(done) {
				//	done();
				//}
			);

			it('should save correctly the tags when writing non recursive to a valid folder'
				//		, function(done) {
				//	done();
				//}
			);

			it('should return error when when writing to a non existing folder'
				//		, function(done) {
				//	done();
				//}
			);
		});

		it('should return error when when invalid path argument is passed', function(done) {
			musicTag.write(0, testsData.test01.data).then(function (result) {
				done(new Error('Value returned: ' + result));
			}).fail(function () {
				done();
			}).catch(function (err) {
				done(err);
			});
		});

		it('should return error when when invalid tags argument is passed', function(done) {
			musicTag.write(testsData.bad_file.path, 1).then(function (result) {
				done(new Error('Value returned: ' + result));
			}).fail(function () {
				done();
			}).catch(function (err) {
				done(err);
			});
		});
	});
});