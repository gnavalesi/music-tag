var assert = require('assert');
var fs = require('fs');
var musicTag = require('../');
var rimraf = require('rimraf');
var should = require('should');
var sinon = require('sinon');
var testsData = require('./test_data');
var unzip = require('unzip');
var _ = require('underscore');
require('should-sinon');

// Mocha functions
var after = require('mocha/lib/mocha.js').after;
var before = require('mocha/lib/mocha.js').before;
var beforeEach = require('mocha/lib/mocha.js').beforeEach;
var describe = require('mocha/lib/mocha.js').describe;

var renewResources = function (done) {
	rimraf(testsData.path + '/**/*', function (err) {
		if (err) {
			done(err);
		} else {
			fs.createReadStream('test/resources.zip')
				.pipe(unzip.Extract({path: 'test'}))
				.on('close', function () {
					done();
				});
		}
	});
};

describe('music-tag', function () {
	before(renewResources);

	describe('read', function () {
		describe('general', function () {
			describe('errors', function () {
				it('should return error when an invalid path argument is passed', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.read(0, options).then(function () {
						assert(false);
						done();
					}).catch(function (err) {
						err.should.be.Error();
						err.message.should.equal('Invalid path argument: 0');
						options.each.should.have.callCount(0);

						done();
					});
				});

				it('should return error when an invalid options argument is passed', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.read(testsData.files.test01.path, 1).then(function () {
						assert(false);
						done();
					}).catch(function (err) {
						err.should.be.Error();
						err.message.should.equal('Invalid options argument: 1');
						options.each.should.have.callCount(0);

						done();
					});
				});
			});
		});

		describe('file', function () {
			describe('valid', function () {
				it('should return a valid object when reading a valid file', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.read(testsData.files.test01.path, options).then(function (result) {
						result.path.should.match(testsData.files.test01.regex);
						result.data.should.deepEqual(testsData.files.test01.data);
						options.each.should.be.calledOnce();

						done();
					}).catch(done);
				});

				it('should return an empty result when reading no id3 tagged file', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.read(testsData.files.bad_file.path, options).then(function (result) {
						result.path.should.match(testsData.files.bad_file.regex);
						result.data.should.deepEqual(testsData.files.bad_file.data);
						options.each.should.be.calledOnce();

						done();
					}).catch(done);
				});
			});

			describe('errors', function () {
				before(function (done) {
					fs.chmod(testsData.files.test02.path, '000', done);
				});

				it('should return error when reading a non existing file', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.read(testsData.path + '/non_existent.mp3', options).then(function (result) {
						done(new Error('Value returned: ' + result));
					}).catch(function () {
						options.each.should.have.callCount(0);

						done();
					});
				});

				it('should return error when reading an invalid file', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.read(testsData.files.another_file.path, options).then(function (result) {
						done(new Error('Value returned: ' + result));
					}).catch(function () {
						options.each.should.have.callCount(0);

						done();
					});
				});

				it('should return error when reading a file with no permissions', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.read(testsData.files.test02.path, options).then(function (result) {
						done(new Error('Value returned: ' + result));
					}).catch(function () {
						options.each.should.have.callCount(0);

						done();
					});
				});

				after(function (done) {
					fs.chmod(testsData.files.test02.path, '600', done);
				});
			});
		});

		describe('folder', function () {
			describe('valid', function () {
				it('should return the right number of valid objects when reading a valid folder', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.read(testsData.path, options).then(function (withoutSlashResult) {
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

						options.each.should.have.callCount(7);

						musicTag.read(testsData.path + '/', options).then(function (withSlashResult) {
							withSlashResult.should.deepEqual(withoutSlashResult);

							done();
						}).catch(function (err) {
							done(err);
						});
					}).catch(done);
				});

				it('should return the right number of valid objects when reading non recursive a valid folder', function (done) {
					var options = {
						each: sinon.spy(),
						recursive: false
					};

					musicTag.read(testsData.path, options).then(function (withoutSlashResult) {
						withoutSlashResult.should.be.Array();
						withoutSlashResult.length.should.be.equal(3);

						withoutSlashResult[0].path.should.match(testsData.files.bad_file.regex);
						withoutSlashResult[0].data.should.deepEqual(testsData.files.bad_file.data);

						withoutSlashResult[1].path.should.match(testsData.files.test01.regex);
						withoutSlashResult[1].data.should.deepEqual(testsData.files.test01.data);

						withoutSlashResult[2].path.should.match(testsData.files.test02.regex);
						withoutSlashResult[2].data.should.deepEqual(testsData.files.test02.data);

						options.each.should.have.callCount(3);

						done();
					}).catch(done);
				});
			});

			describe('errors', function () {
				before(function (done) {
					fs.chmod(testsData.directories.directory01.path, '000', done);
				});

				it('should return error when reading a non existing folder', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.read(testsData.path + '/non_existent', options).then(function () {
						assert(false);
						done();
					}).catch(function (err) {
						err.should.be.Error();
						options.each.should.have.callCount(0);

						done();
					});
				});

				it('should return error when reading a folder with no permissions', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.read(testsData.directories.directory01.path, options).then(function () {
						assert(false);
						done();
					}).catch(function (err) {
						err.should.be.Error();
						options.each.should.have.callCount(0);

						done();
					});
				});

				after(function (done) {
					fs.chmod(testsData.directories.directory01.path, '777', done);
				});
			});
		});

	});

	describe('write', function () {
		beforeEach(function () {
			fs.writeFile(testsData.files.bad_file.path, '');
			fs.writeFile(testsData.files.another_file.path, '');
		});

		describe('general', function () {
			describe('errors', function () {
				it('should return error when when invalid path argument is passed', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(0, testsData.files.test01.data, options).then(function (result) {
						done(new Error('Value returned: ' + result));
					}).catch(function () {
						done();
					});
				});

				it('should return error when when invalid tags argument is passed', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(testsData.files.bad_file.path, 1, options).then(function (result) {
						done(new Error('Value returned: ' + result));
					}).catch(function () {
						options.each.should.have.callCount(0);
						done();
					});
				});

				it('should return error when when invalid options argument is passed', function (done) {
					musicTag.write(testsData.files.bad_file.path, testsData.files.test01.data, 1).then(function (result) {
						done(new Error('Value returned: ' + result));
					}).catch(function () {
						done();
					});
				});
			});
		});

		describe('file', function () {

			describe('valid', function () {
				it('should save correctly the tags when writing to a non id3 tagged file', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(testsData.files.bad_file.path, testsData.files.test01.data, options).then(function (result) {
						result.path.should.match(testsData.files.bad_file.regex);
						result.data.should.deepEqual(testsData.files.test01.data);

						musicTag.read(testsData.files.bad_file.path).then(function (readResult) {
							readResult.data.should.deepEqual(testsData.files.test01.data);
							options.each.should.be.calledOnce();

							done();
						}).catch(done);
					}).catch(done);
				});

				it('should save correctly the tags when writing to a valid file', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(testsData.files.test01.path, testsData.files.test01.data, options).then(function (result) {
						result.path.should.match(testsData.files.test01.regex);
						result.data.should.deepEqual(testsData.files.test01.data);

						options.each.should.be.calledOnce();

						musicTag.read(testsData.files.test01.path).then(function (readResult) {
							readResult.data.should.deepEqual(testsData.files.test01.data);
							done();
						}).catch(done);
					}).catch(done);
				});

				it('should save correctly custom tags when writing to a valid file', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(testsData.files.test02.path, {custom: 'a value'}, options).then(function (result) {
						result.path.should.match(testsData.files.test02.regex);
						result.data.should.deepEqual(_.extend(_.clone(testsData.files.test02.data), {custom: 'a value'}));
						options.each.should.be.calledOnce();

						musicTag.read(testsData.files.test02.path).then(function (readResult) {
							readResult.data.should.deepEqual(_.extend(_.clone(testsData.files.test02.data), {custom: 'a value'}));
							done();
						}).catch(done);
					}).catch(done);
				});

				it('should save and return correctly tags when replacing tags to a valid file', function (done) {
					var options = {
						replace: true,
						each: sinon.spy()
					};

					musicTag.write(testsData.files.bad_file.path, {custom: 'a value'}, options).then(function (result) {
						result.path.should.match(testsData.files.bad_file.regex);
						result.data.should.deepEqual({custom: 'a value'});
						options.each.should.be.calledOnce();

						musicTag.read(testsData.files.bad_file.path).then(function (readResult) {
							readResult.data.should.deepEqual({custom: 'a value'});
							done();
						}).catch(done);
					}).catch(done);
				});
			});

			describe('errors', function () {
				before(function (done) {
					fs.chmod(testsData.files.test01.path, '000', done);
				});

				it('should return error when writing to a non existing file', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(testsData.path + '/non_existent.mp3', testsData.files.test01.data, options).then(function (result) {
						done(new Error('Value returned: ' + result));
					}).catch(function () {
						options.each.should.have.callCount(0);

						done();
					});
				});

				it('should return error when writing to an invalid file', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(testsData.files.another_file, testsData.files.test01.data, options).then(function (result) {
						done(new Error('Value returned: ' + _.pairs(result)));
					}).catch(function () {
						options.each.should.have.callCount(0);

						done();
					});
				});

				it('should return error when writing a file with no permissions', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(testsData.files.test01.path, testsData.files.test02.data, options).then(function (result) {
						done(new Error('Value returned: ' + _.pairs(result)));
					}).catch(function () {
						options.each.should.have.callCount(0);

						done();
					});
				});

				after(function (done) {
					fs.chmod(testsData.files.test01.path, '777', done);
				});
			});
		});

		describe('folder', function () {
			before(renewResources);

			describe('valid', function () {
				it('should save correctly the tags when writing non recursive to a valid folder', function (done) {
					var options = {
						each: sinon.spy(),
						recursive: false
					};

					musicTag.write(testsData.path, {
						year: '2005'
					}, options).then(function (result) {
						result.should.be.Array();
						result.length.should.be.equal(3);

						result[0].path.should.match(testsData.files.bad_file.regex);
						result[0].data.should.deepEqual({year: '2005'});

						result[1].path.should.match(testsData.files.test01.regex);
						result[1].data.should.deepEqual(_.extend(testsData.files.test01.data, {year: '2005'}));

						result[2].path.should.match(testsData.files.test02.regex);
						result[2].data.should.deepEqual(_.extend(testsData.files.test02.data, {year: '2005'}));

						options.each.should.have.callCount(3);

						musicTag.read(testsData.path, {
							recursive: false
						}).then(function (readResult) {
							readResult.should.be.Array();
							readResult.length.should.be.equal(3);

							readResult[0].path.should.match(testsData.files.bad_file.regex);
							readResult[0].data.should.deepEqual({year: '2005'});

							readResult[1].path.should.match(testsData.files.test01.regex);
							readResult[1].data.should.deepEqual(_.extend(testsData.files.test01.data, {year: '2005'}));

							readResult[2].path.should.match(testsData.files.test02.regex);
							readResult[2].data.should.deepEqual(_.extend(testsData.files.test02.data), {year: '2005'});

							done();
						}).catch(done);
					}).catch(done);
				});

				it('should save correctly the tags when writing to a valid folder', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(testsData.path, {
						year: '1999'
					}, options).then(function (result) {
						result.should.be.Array();
						result.length.should.be.equal(7);

						result[0].path.should.match(testsData.files.bad_file.regex);
						result[0].data.should.deepEqual({year: '1999'});

						result[1].path.should.match(testsData.directories.directory01.files.test03.regex);
						result[1].data.should.deepEqual(testsData.directories.directory01.files.test03.data);

						result[2].path.should.match(testsData.directories.directory01.files.test04.regex);
						result[2].data.should.deepEqual(testsData.directories.directory01.files.test04.data);

						result[3].path.should.match(testsData.directories.directory02.files.test05.regex);
						result[3].data.should.deepEqual(testsData.directories.directory02.files.test05.data);

						result[4].path.should.match(testsData.directories.directory02.files.test06.regex);
						result[4].data.should.deepEqual(testsData.directories.directory02.files.test06.data);

						result[5].path.should.match(testsData.files.test01.regex);
						result[5].data.should.deepEqual(_.extend(testsData.files.test01.data, {year: '1999'}));

						result[6].path.should.match(testsData.files.test02.regex);
						result[6].data.should.deepEqual(_.extend(testsData.files.test02.data, {year: '1999'}));

						options.each.should.have.callCount(7);

						musicTag.read(testsData.path).then(function (readResult) {
							readResult.should.be.Array();
							readResult.length.should.be.equal(7);

							readResult[0].path.should.match(testsData.files.bad_file.regex);
							readResult[0].data.should.deepEqual({year: '1999'});

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
						}).catch(done);
					}).catch(done);
				});
			});

			describe('errors', function () {
				before(function (done) {
					fs.chmod(testsData.directories.directory01.path, '000', done);
				});

				it('should return error when when writing to a non existing folder', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(testsData.path + '/non_existent/', testsData.files.test01.data, options).then(function (result) {
						done(new Error('Value returned: ' + result));
					}).catch(function () {
						options.each.should.have.callCount(0);

						done();
					});
				});

				it('should return error when writing a folder with no permissions', function (done) {
					var options = {
						each: sinon.spy()
					};

					musicTag.write(testsData.directories.directory01.path, testsData.files.test01.data, options).then(function (result) {
						done(new Error('Value returned: ' + result));
					}).catch(function () {
						options.each.should.have.callCount(0);

						done();
					});
				});

				after(function (done) {
					fs.chmod(testsData.directories.directory01.path, '777', done);
				});
			});
		});
	});
});