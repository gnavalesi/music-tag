(function() {
	'use strict';

	module.exports = {
		path: 'test/resources/',
		directories: {
			directory01: {
				path: 'test/resources/directory01/',
				files: {
					test03: {
						path: 'test/resources/directory01/test03.mp3',
						regex: /test\/resources\/directory01\/test03\.mp3$/,
						data: {
							artist: 'Artist 03',
							title: 'Title 03',
							album: 'Album 03',
							genre: '(13)',
							year: '1999'
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
							year: '1999'
						}
					}
				}
			},
			directory02: {
				path: 'test/resources/directory02',
				files: {
					test05: {
						path: 'test/resources/directory02/test05.mp3',
						regex: /test\/resources\/directory02\/test05\.mp3$/,
						data: {
							artist: 'Artist 05',
							title: 'Title 05',
							album: 'Album 05',
							genre: '(13)',
							year: '1999'
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
							year: '1999'
						}
					}
				}
			}
		},
		files: {
			test01 : {
				path: 'test/resources/test01.mp3',
				regex: /test\/resources\/test01\.mp3$/,
				data: {
					artist: 'Artist 01',
					title: 'Title 01',
					album: 'Album 01',
					genre: '(13)',
					year: '1999'
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
					year: '1999'
				}
			},
			bad_file: {
				path: 'test/resources/bad_file.mp3',
				regex: /test\/resources\/bad_file\.mp3$/,
				data: {}
			},
			another_file: {
				path: 'test/resources/another_file.ext',
				regex: /test\/resources\/another_file\.ext/,
				data: {}
			},
			unreadable: {
				path: 'test/resources/unreadable.mp3',
				regex: /test\/resources\/unreadable\.mp3/,
				data: {}
			}
		}
	};
})();