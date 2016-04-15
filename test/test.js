var assert = require('assert');
var musicTag = require('../src');
var _ = require('underscore');
var testsData = require('./test_data');
var should = require('should');
var fs = require('fs');

describe('music-tag', function () {
	beforeEach(function () {
		fs.writeFile(testsData.files.bad_file.path, '');
		fs.writeFile(testsData.files.another_file.path, '');
	});

	describe('read', function () {
		describe('file', function () {
			it('should return a valid object when reading a valid file', function (done) {
				musicTag.read(testsData.files.test01.path).then(function (result) {
					result.path.should.match(testsData.files.test01.regex);
					result.data.should.deepEqual(testsData.files.test01.data);
					done();
				}).fail(function (err) {
					done(err);
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return an empty result when reading no id3 tagged file', function (done) {
				musicTag.read(testsData.files.bad_file.path).then(function (result) {
					result.path.should.match(testsData.files.bad_file.regex);
					result.data.should.deepEqual(testsData.files.bad_file.data);
					done();
				}).fail(function (err) {
					done(err);
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return error when reading a non existing file', function (done) {
				musicTag.read(testsData.path + '/non_existent.mp3').then(function (result) {
					done(new Error('Value returned: ' + result));
				}).fail(function () {
					done();
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return error when reading an invalid file', function (done) {
				musicTag.read(testsData.files.another_file.path).then(function (result) {
					done(new Error('Value returned: ' + result));
				}).fail(function () {
					done();
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return error when reading a file with no permissions');
		});

		describe('folder', function () {
			it('should return the right number of valid objects when reading a valid folder', function (done) {
				musicTag.read(testsData.path).then(function (withoutSlashResult) {
					withoutSlashResult.should.be.Array();
					withoutSlashResult.length.should.be.equal(7);

					withoutSlashResult[0].path.should.match(testsData.files.bad_file.regex);
					withoutSlashResult[0].data.should.deepEqual(testsData.files.bad_file.data);

					withoutSlashResult[1].path.should.match(testsData.directories.directory01.files.test03.regex);
					withoutSlashResult[1].data.should.deepEqual(testsData.directories.directory01.files.test03.data);

					withoutSlashResult[2].path.should.match(testsData.directories.directory01.files.test04.regex);
					withoutSlashResult[2].data.should.deepEqual(testsData.directories.directory01.files.test04.data);

					withoutSlashResult[3].path.should.match(testsData.directories.directory02.files.test05.regex);
					withoutSlashResult[3].data.should.deepEqual(testsData.directories.directory02.files.test05.data);

					withoutSlashResult[4].path.should.match(testsData.directories.directory02.files.test06.regex);
					withoutSlashResult[4].data.should.deepEqual(testsData.directories.directory02.files.test06.data);

					withoutSlashResult[5].path.should.match(testsData.files.test01.regex);
					withoutSlashResult[5].data.should.deepEqual(testsData.files.test01.data);

					withoutSlashResult[6].path.should.match(testsData.files.test02.regex);
					withoutSlashResult[6].data.should.deepEqual(testsData.files.test02.data);

					musicTag.read(testsData.path + '/').then(function (withSlashResult) {
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
				musicTag.read(testsData.path, {
					recursive: false
				}).then(function (withoutSlashResult) {
					withoutSlashResult.should.be.Array();
					withoutSlashResult.length.should.be.equal(3);

					withoutSlashResult[0].path.should.match(testsData.files.bad_file.regex);
					withoutSlashResult[0].data.should.deepEqual(testsData.files.bad_file.data);

					withoutSlashResult[1].path.should.match(testsData.files.test01.regex);
					withoutSlashResult[1].data.should.deepEqual(testsData.files.test01.data);

					withoutSlashResult[2].path.should.match(testsData.files.test02.regex);
					withoutSlashResult[2].data.should.deepEqual(testsData.files.test02.data);

					done();
				}).fail(function (err) {
					done(err);
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return error when reading a non existing folder', function (done) {
				musicTag.read(testsData.path + '/non_existent').then(function () {
					assert(false);
					done();
				}).fail(function (err) {
					err.should.be.Error();
					done();
				});
			});

			it('should return error when reading a folder with no permissions');
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
				musicTag.write(testsData.files.bad_file.path, testsData.files.test01.data).then(function (result) {
					result.path.should.match(testsData.files.bad_file.regex);

					musicTag.read(testsData.files.bad_file.path).then(function (readResult) {
						readResult.data.should.deepEqual(testsData.files.test01.data);
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
				musicTag.write(testsData.files.bad_file.path, testsData.files.test02.data).then(function (result) {
					result.path.should.match(testsData.files.bad_file.regex);

					musicTag.read(testsData.files.bad_file.path).then(function (readResult) {
						readResult.data.should.deepEqual(testsData.files.test02.data);
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

			it('should return error when writing to a non existing file', function (done) {
				musicTag.write(testsData.path + '/non_existent.mp3', testsData.files.test01.data).then(function (result) {
					done(new Error('Value returned: ' + result));
				}).fail(function () {
					done();
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return error when writing to an invalid file', function (done) {
				musicTag.write(testsData.files.another_file, testsData.files.test01.data).then(function (result) {
					done(new Error('Value returned: ' + _.pairs(result)));
				}).fail(function () {
					done();
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return error when writing a file with no permissions');
		});

		describe('folder', function () {
			it('should save correctly the tags when writing non recursive to a valid folder'/*, function (done) {
				musicTag.write(path: testsData.path, {
					year: '2005'
				}, {
			 			 recursive: false
			 }).then(function (result) {
					result.should.be.Array();
					result.length.should.be.equal(2);

					result[0].path.should.match(testsData.files.test01.regex);
					result[0].data.should.deepEqual(_.extend(testsData.files.test01.data, {year: '2005'}));

					result[1].path.should.match(testsData.files.test02.regex);
					result[1].data.should.deepEqual(_.extend(testsData.files.test02.data), {year: '2005'});

					musicTag.read(testsData.path).then(function (readResult) {
						readResult.should.be.Array();
						readResult.length.should.be.equal(2);

						readResult[0].path.should.match(testsData.files.test01.regex);
						readResult[0].data.should.deepEqual(_.extend(testsData.files.test01.data, {year: '2005'}));

						readResult[1].path.should.match(testsData.files.test02.regex);
						readResult[1].data.should.deepEqual(_.extend(testsData.files.test02.data), {year: '2005'});

						done();
					}).fail(function (err) {
						done(err);
					}).catch(function (err) {
						done(err);
					});

					done();
				}).fail(function (err) {
					done(err);
				}).catch(function (err) {
					done(err);
				});
			}*/);

			it('should save correctly the tags when writing to a valid folder'/*, function (done) {
				musicTag.write(testsData.path, {
					year: '1999'
				}).then(function (result) {
					result.should.be.Array();
					result.length.should.be.equal(7);

					result[0].path.should.match(testsData.files.bad_file.regex);
					result[0].data.should.deepEqual(testsData.files.bad_file.data);

					result[1].path.should.match(testsData.directories.directory01.files.test03.regex);
					result[1].data.should.deepEqual(testsData.directories.directory01.files.test03.data);

					result[2].path.should.match(testsData.directories.directory01.files.test04.regex);
					result[2].data.should.deepEqual(testsData.directories.directory01.files.test04.data);

					result[3].path.should.match(testsData.directories.directory02.files.test05.regex);
					result[3].data.should.deepEqual(testsData.directories.directory02.files.test05.data);

					result[4].path.should.match(testsData.directories.directory02.files.test06.regex);
					result[4].data.should.deepEqual(testsData.directories.directory02.files.test06.data);

					result[5].path.should.match(testsData.files.test01.regex);
					result[5].data.should.deepEqual(testsData.files.test01.data);

					result[6].path.should.match(testsData.files.test02.regex);
					result[6].data.should.deepEqual(testsData.files.test02.data);

					musicTag.read(testsData.path).then(function (readResult) {
						readResult.should.be.Array();
						readResult.length.should.be.equal(2);

						readResult[0].path.should.match(testsData.files.bad_file.regex);
						readResult[0].data.should.deepEqual(testsData.files.bad_file.data);

						readResult[1].path.should.match(testsData.directories.directory01.files.test03.regex);
						readResult[1].data.should.deepEqual(testsData.directories.directory01.files.test03.data);

						readResult[2].path.should.match(testsData.directories.directory01.files.test04.regex);
						readResult[2].data.should.deepEqual(testsData.directories.directory01.files.test04.data);

						readResult[3].path.should.match(testsData.directories.directory02.files.test05.regex);
						readResult[3].data.should.deepEqual(testsData.directories.directory02.files.test05.data);

						readResult[4].path.should.match(testsData.directories.directory02.files.test06.regex);
						readResult[4].data.should.deepEqual(testsData.directories.directory02.files.test06.data);

						readResult[5].path.should.match(testsData.files.test01.regex);
						readResult[5].data.should.deepEqual(testsData.files.test01.data);

						readResult[6].path.should.match(testsData.files.test02.regex);
						readResult[6].data.should.deepEqual(testsData.files.test02.data);

						done();
					}).fail(function (err) {
						done(err);
					}).catch(function (err) {
						done(err);
					});

					done();
				}).fail(function (err) {
					done(err);
				}).catch(function (err) {
					done(err);
				});
			}*/);

			it('should return error when when writing to a non existing folder', function (done) {
				musicTag.write(testsData.path + '/non_existent/', testsData.files.test01.data).then(function (result) {
					done(new Error('Value returned: ' + result));
				}).fail(function () {
					done();
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return error when writing a folder with no permissions');
		});

		it('should return error when when invalid path argument is passed', function (done) {
			musicTag.write(0, testsData.files.test01.data).then(function (result) {
				done(new Error('Value returned: ' + result));
			}).fail(function () {
				done();
			}).catch(function (err) {
				done(err);
			});
		});

		it('should return error when when invalid tags argument is passed', function (done) {
			musicTag.write(testsData.files.bad_file.path, 1).then(function (result) {
				done(new Error('Value returned: ' + result));
			}).fail(function () {
				done();
			}).catch(function (err) {
				done(err);
			});
		});
	});
});