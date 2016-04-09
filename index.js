var reader = require('./src/lib/reader');
var writer = require('./src/lib/writer');

//reader.readFile('./resources/Aenaon/2014 - Extance/01. The First Art.mp3').then(function(data) {
//	console.log('data', data);
//}, function(err) {
//	console.error('err', err);
//});

//reader.readFile('./resources/Aenaon/2014 - Extance/02. Deathtrip Chronicle.mp3').then(function(data) {
//	console.log('data', data);
//}, function(err) {
//	console.error('err', err);
//});
/*
 reader.readFolder('./resources/Aenaon/2014 - Extance/').then(function(data) {
 console.log('data', data);
 }, function(err) {
 console.error('err', err);
 });
 */
/*
 reader.readFile('./resources/Aenaon/2014 - Extance/02. Deathtrip Chronicle.mp3', function(err, data) {
 if(err) {
 console.error('read error', err);
 } else {
 console.log('read data', data);
 }
 });
 */
reader.read('./resources/Aenaon/2014 - Extance/02. Deathtrip Chronicle.mp3', function (err, data) {
	console.log('---------------------');
	if (err) {
		console.log('read file error\n', err);
	} else {
		console.log('read file data\n', data);
	}
	console.log('---------------------');
});

reader.read('./resources/Aenaon/2014 - Extance/', function (err, data) {
	console.log('---------------------');
	if (err) {
		console.log('read folder error\n', err);
	} else {
		console.log('read folder data\n', data);
	}
	console.log('---------------------');
});

reader.read('./resources/Aenaon/', function (err, data) {
	console.log('---------------------');
	if (err) {
		console.log('read recursive folder error\n', err);
	} else {
		console.log('read recursive folder data\n', data);
	}
	console.log('---------------------');
});

reader.read([
	'./resources/Aenaon/2014 - Extance/02. Deathtrip Chronicle.mp3',
	'./resources/Aenaon/2014 - Extance/01. The First Art.mp3'
], function (err, data) {
	console.log('---------------------');
	if (err) {
		console.log('read files error\n', err);
	} else {
		console.log('read files data\n', data);
	}
	console.log('---------------------');
});

reader.read([
	'./resources/Aenaon/2014 - Extance/02. Deathtrip Chronicle.mp3',
	'./resources/Aenaon/2014 - Extance/01. The First Art.mp3',
	'./resources/Aenaon/2014 - Extance/01. The First Art.mp3'
], function (err, data) {
	console.log('---------------------');
	if (err) {
		console.log('read repeated files error\n', err);
	} else {
		console.log('read repeated files data\n', data);
	}
	console.log('---------------------');
});

reader.read([
	'./resources/Aenaon/2014 - Extance/',
	'./resources/Aenaon/2014 - Extance/01. The First Art.mp3'
], function (err, data) {
	console.log('---------------------');
	if (err) {
		console.log('read folder and file in same folder error\n', err);
	} else {
		console.log('read folder and file in same folder data\n', data);
	}
	console.log('---------------------');
});
/*
 reader.readFolder('./resources/Aenaon/2014 - Extance/', function(err, data) {
 if(err) {
 console.error('read error', err);
 } else {
 console.log('read data', data);
 }
 });
 */

$(function() {
	function read() {

	}

	function write() {

	}

	module.exports = {
		read: reader.read,
		write: writer.write
	};
})();



