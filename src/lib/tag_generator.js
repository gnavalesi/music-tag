/*jslint sub: true*/
(function() {
	'use strict';

	var _ = require('underscore'),
			Buffer = require('buffer').Buffer;

	var config = require('../../config/config.json');

	var generate = function (params) {
		var data = makeTags(params.tags);
		var tag_header = makeHeader(data.total_size);

		return Buffer.concat([tag_header, data.tag_content]);
	};

	var makeHeader = function (total_size) {
		var tag_header = new Buffer(10);

		tag_header.write('ID3', 0, 3);
		tag_header.writeUInt8('0x3', 3);
		tag_header.writeUInt8('0x0', 4);
		tag_header.writeUInt32BE(total_size, 6);

		return tag_header;
	};

	var writeTag = function(tag, tag_content, tag_buffer, pos) {
		var tag_size = tag_content.length;

		tag_buffer.write(tag.toString('ascii'), pos, 4, 'ascii');
		tag_buffer.write(tag_content.toString('ascii'), pos + 10, pos + 10 + tag_size);
		tag_buffer.writeUInt32BE(tag_size, pos + 4);
		tag_buffer.write('\u0000\u0000', pos + 8, pos + 10);

		return pos + tag_size + 10;
	};

	var makeTags = function (tags) {
		var frames = {},
				labels = _.invert(config.labels),
				data = {
					tag_content: null,
					total_size: 0
				};

		_.each(_.keys(tags), function(it) {
			var label = it.toLowerCase().replace(/_/g, ' ');
			var tag = labels[label];

			if (!_.isUndefined(tag)) {
				frames[tag] =
						(tag === 'APIC' ? '\u0000\u0069\u006D\u0061\u0067\u0065\u002F\u0070\u006E\u0067\u0000\u0003\u0000' : '\u0000') +
						tags[it];

				data.total_size += (tag === 'APIC' ? 13 + 10 : 11) + frames[tag].length;
			} else {
				if (_.isUndefined(frames['TXXX'])) {
					frames['TXXX'] = [];
				}

				frames['TXXX'].push(label + '\u0000' + tags[it]);
				data.total_size += 10 + _.last(frames['TXXX']).length;
			}
		});

		// calculate the total size of the tags
		data.total_size = calculateTotalTagSize(data.total_size);

		var tag_buffer = new Buffer(data.total_size + 10),
				pos = 0;

		tag_buffer.fill('');

		_.each(_.keys(frames), function(t) {
			if (t === 'TXXX') {
				_.each(_.keys(frames[t]), function(ttx) {
					pos = writeTag(t, frames[t][ttx], tag_buffer, pos);
				});
			} else {
				pos = writeTag(t, frames[t], tag_buffer, pos);
			}
		});

		data.tag_content = tag_buffer;

		return data;
	};

	var calculateTotalTagSize = function (total_size) {
		//calculate new tag size, convert to special 28-bit int
		var bit_size = total_size.toString(2);
		var formatted_size = new Array(32);
		var appended_size = new Array(32);

		for (var i = 0; i < 32; i++) {
			if (i < (32 - bit_size.length)) {
				appended_size[i] = 0;
			}
			else {
				appended_size[i] = parseInt(bit_size[i - (32 - bit_size.length)]);
			}
		}

		var bit_pos = 0;
		for (var j = 4; j < 32; j++) {
			if (bit_pos % 8 === 0) {
				formatted_size[bit_pos] = 0;
				bit_pos++;
			}
			formatted_size[bit_pos] = appended_size[j];
			bit_pos++;
		}

		return parseInt(formatted_size.join(""), 2);
	};

	module.exports = {
		generate: generate
	};
})();
