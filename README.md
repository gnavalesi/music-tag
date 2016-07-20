# music-tag

[![Build Status](https://travis-ci.org/gnavalesi/music-tag.svg?branch=master)](https://travis-ci.org/gnavalesi/music-tag) [![Test Coverage](https://codeclimate.com/github/gnavalesi/music-tag/badges/coverage.svg)](https://codeclimate.com/github/gnavalesi/music-tag/coverage) [![Code Climate](https://codeclimate.com/github/gnavalesi/music-tag/badges/gpa.svg)](https://codeclimate.com/github/gnavalesi/music-tag) [![Dependency Status](https://www.versioneye.com/user/projects/5712a0ccfcd19a004544118e/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5712a0ccfcd19a004544118e)

ID3 reader and writer for NodeJS

## Usage

#### id3.read(path, [opts])

The `read` method returns a promise for a `ReadResult` or an array of `ReadResult` of the path requested. The `path` parameter is a 
 String with the path (relative or absolute) of a file or folder. The optional `opts` parameter is an object with the
 following properties:
 
 - ```recursive```: Read recursively when the path parameter is a folder path. ( _Boolean. Default: true_ )
 - ```each```: A function to be called for each result ( _Function (ReadResult). Default: null_ )
 
For example:
 
```javascript
var id3 = require('music-tag');

id3.read('music.mp3').then(function(result) {
	console.log(result.data);
}).fail(function(err) {
	throw err;
});
```

#### id3.write(path, tags, [opts])

The `write` method returns a promise for a `WriteResult` or an array of `WriteResult` of the path requested. The `path` parameter 
 is a String with the path (relative or absolute) of a file or folder. The `tags` parameter is an object with the new 
 tags to add to the path. The optional `opts` parameter is an object with the following properties:
 
 - ```recursive```: Write recursively when the path parameter is a folder path. ( _Boolean. Default: true_ )
 - ```each```: A function to be called for each result ( _Function (WriteResult). Default: null_ )
 - ```replace```: Removes any previously existing tag. ( _Boolean. Default: false_ )
 
For example:
 
```javascript
var id3 = require('music-tag');

id3.write('music.mp3', { artist: 'Me' }).then(function(result) {
	console.log(result.tags);
}).fail(function(err) {
	throw err;
});
```

### ReadResult

The `ReadResult` object contains the following properties:

 - ```path```: Path of the read file ( _String_ )
 - ```tags```: The tags read ( _Object_ )

### WriteResult

The `WriteResult` object contains the following properties:

 - ```path```: Path of the written file ( _String_ )
 - ```tags```: The tags written ( _Object_ )
 

## Development

Run the following command to install the development dependencies:
```bash
npm install
```

The project uses Gulp as build system. Run the following command to install gulp:
```bash
npm install -g gulp
```

The `dev` task provides a loop that runs JSHint and Mocha when a change is detected. Run the following command to start the task:
```bash
gulp dev
```
