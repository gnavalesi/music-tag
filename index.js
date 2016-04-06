var reader = require('./lib/reader');
var writer = require('./lib/writer');

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

reader.readFile('./resources/Aenaon/2014 - Extance/02. Deathtrip Chronicle.mp3').then(function(data) {
	console.log('read data', data);

	writer.writeFile('./resources/Aenaon/2014 - Extance/02. Deathtrip Chronicle.mp3', {
		'what': 'what',
		'in_the': 'butt',
		'o': 'yeah',
		'como': 'va mundo'
	}).then(function(data) {
		console.log('write data', data);

		reader.readFile('./resources/Aenaon/2014 - Extance/02. Deathtrip Chronicle.mp3').then(function(data) {
			console.log('read data', data);
		}, function(err) {
			console.error('read err', err);
		});
	}, function(err) {
		console.error('write err', err);
	});
}, function(err) {
	console.error('read err', err);
});



module.exports = {
	reader: reader
};
