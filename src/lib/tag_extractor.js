var _ = require('underscore');
var config = require('../../config/config.json');

(function () {
	'use strict';

	var extract = function (tags) {
		return processTags(tags);
	};

	var getUserData = function (tag_text) {
		return {
			label: tag_text.substr(0, tag_text.lastIndexOf('\u0000')),
			text: tag_text.substr(tag_text.lastIndexOf('\u0000') + 1)
		};
	};

	var getTag = function (content, pos) {
		return {
			size: content.readUInt32BE(pos + 4),
			label: content.slice(pos, pos + 4).toString('ascii')
		};
	};

	var getTagData = function (content, tag, pos) {
		return {
			label: config.labels[tag.label].toLowerCase().replace(/\s/g, '_'),
			text: content.slice(pos + 10, pos + 10 + tag.size).toString('UTF-8').replace(/^[\u0000-\u0009]+/, '')
		};
	};

	var processTags = function (content) {
		var tags = {};

		var pos = 10;

		while (pos < content.length - 10) {
			var tag = getTag(content, pos);

			if (_.isUndefined(config.labels[tag.label]) === false) {
				var data = getTagData(content, tag, pos);

				// is this some user defined tag?
				if (data.label === "user_defined_text_information_frame") {
					data = getUserData(data.text);
				}

				// if we have something in the text then put it in
				if (!_.isUndefined(data.label) && !_.isUndefined(data.text) && data.text !== "") {
					tags[data.label] = data.text;
				}
			}

			pos += (tag.size + 10);
		}

		return tags;
	};

	module.exports = {
		extract: extract
	};
}());