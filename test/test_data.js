(function() {
	'use strict';

	module.exports = {
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
})();