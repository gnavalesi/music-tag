# music-tag

[![Build Status](https://travis-ci.org/gnavalesi/music-tag.svg?branch=master)](https://travis-ci.org/gnavalesi/music-tag) [![Coverage Status](https://coveralls.io/repos/github/gnavalesi/music-tag/badge.svg?branch=master)](https://coveralls.io/github/gnavalesi/music-tag?branch=master) [![Code Climate](https://codeclimate.com/github/gnavalesi/music-tag/badges/gpa.svg)](https://codeclimate.com/github/gnavalesi/music-tag) [![Dependency Status](https://www.versioneye.com/user/projects/5712a0ccfcd19a004544118e/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5712a0ccfcd19a004544118e)

ID3 reader and writer for NodeJS


## Usage

### id3.read(path, [opts])

The `read` method returns a promise for an object with the id3 tags of the path requested. The `path` parameter is a 
 String with the path (relative or absolute) of a file or folder. The optional `opts` parameter is an object with the
 following properties:
 
 - ```recursive```: Read recursively when the path parameter is a folder path. ( _Default: true_ )
 - ```each```: A function to be called for each result ( _Default: null_ )
 
For example:
 
```javascript
var id3 = require('music-tag');

id3.read('music.mp3').then(function(tags) {
	console.log(tags);
}).fail(function(err) {
	throw err;
});
```

### id3.write(path, tags, [opts])

The `write` method returns a promise for an object with the writen id3 tags of the path requested. The `path` parameter 
 is a String with the path (relative or absolute) of a file or folder. The `tags` parameter is an object with the new 
 tags to add to the path. The optional `opts` parameter is an object with the following properties:
 
 - ```recursive```: Write recursively when the path parameter is a folder path. ( _Default: true_ )
 - ```replace```: Removes any previously existing tag. ( _Default: false_ )
 
For example:
 
```javascript
var id3 = require('music-tag');

id3.write('music.mp3', { artist: 'Me' }).then(function(tags) {
	console.log(tags);
}).fail(function(err) {
	throw err;
});
```

