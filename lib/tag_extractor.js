// include some libraries
var _ = require('underscore'),
	fs = require('fs'),
	Buffer = require('buffer').Buffer;

// include the tag config
var config = require('../config/config.json');

function TagExtractor() {
	return this;
}

TagExtractor.prototype.extract = function (tag_data) {
	return _.extend(processTags(tag_data.tags), {version: tag_data.version});
};

var getUserData = function (tag_text) {
	return {
		label: tag_text.substr(0, tag_text.lastIndexOf('\u0000')),
		text: tag_text.substr(tag_text.lastIndexOf('\u0000') + 1)
	};
};

var processTags = function (content) {
	var tags = {
		artist: "unknown",
		title: "unknown",
		album: "unknown",
		genre: "unknown"
	};

	var pos = 10;

	while (pos < content.length - 10) {
		var tag_size = content.readUInt32BE(pos + 4);
		var tag_label = content.slice(pos, pos + 4).toString('ascii');

		if (_.isUndefined(config.labels[tag_label]) === false) {
			var label = config.labels[tag_label].toLowerCase().replace(/\s/g, '_');
			var text = content.slice(pos + 10, pos + 10 + tag_size).toString('UTF-8').replace(/^[\u0000-\u0009]+|~|�/, '');

			// is this some user defined tag?
			if (label === "user_defined_text_information_frame") {
				var tag_data = getUserData(text);
				label = tag_data.label;
				text = tag_data.text;
			}

			// if we have something in the text then put it in
			if (!_.isUndefined(label) && !_.isUndefined(text) && text !== "") {
				tags[label] = text;
			}
		}

		pos += (tag_size + 10);
	}

	return tags;
};

module.exports = new TagExtractor();