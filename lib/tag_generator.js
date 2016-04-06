var _ = require('underscore'),
	async = require('async'),
	Buffer = require('buffer').Buffer;

// include the tag config
var config = require('../config/config.json');
//,
//_instance   = null;

function TagGenerator() {
	return this;
}

TagGenerator.prototype.generate = function (params, callback) {
	var data = {
		tags: params.tags,
		tag_header: null,
		tag_content: null,
		total_size: null
	};

	data = makeTags(data);
	data.tag_header = makeHeader(data.total_size);

	return callback(null, Buffer.concat([data.tag_header, data.tag_content]));
};

var makeHeader = function (total_size) {
	var tag_header = new Buffer(10);

	tag_header.write('ID3', 0, 3);
	tag_header.writeUInt8('0x4', 3);
	tag_header.writeUInt8('0x0', 4);
	tag_header.writeUInt32BE(total_size, 6);

	return tag_header;
};

var makeTags = function (data) {
	var tags = {},
		labels = _.invert(config.labels);

	delete(data.tags.version);

	_.each(_.keys(data.tags), function(it) {
		var label = it.toLowerCase().replace(/_/g, ' ');
		var tag = labels[label];

		if (!_.isUndefined(tag)) {
			tags[tag] =
				(tag === 'APIC' ? '\u0000\u0069\u006D\u0061\u0067\u0065\u002F\u0070\u006E\u0067\u0000\u0003\u0000' : '\u0000')
				+ data.tags[it];

			data.total_size += (tag === 'APIC' ? 13 + 10 : 11) + tags[tag].length;
		} else {
			if (_.isUndefined(tags['TXXX'])) {
				tags['TXXX'] = [];
			}

			tags['TXXX'].push(label + '\u0000' + data.tags[it]);
			data.total_size += 10 + _.last(tags['TXXX']).length;
		}
	});

	// calculate the total size of the tags
	data.total_size = calculateTotalTagSize(data.total_size);

	var tag_buffer = new Buffer(data.total_size + 10),
		pos = 0;

	tag_buffer.fill('');

	_.each(_.keys(tags), function(t) {
		if (t === 'TXXX') {
			_.each(_.keys(tags[t]), function(ttx) {
				var tag_size = tags[t][ttx].length;

				tag_buffer.write(t.toString('ascii'), pos, 4, 'ascii');
				tag_buffer.write(tags[t][ttx].toString('ascii'), pos + 10, pos + 10 + tag_size);
				tag_buffer.writeUInt32BE(tag_size, pos + 4);
				tag_buffer.write('\u0000\u0000', pos + 8, pos + 10);

				pos += tag_size + 10;
			});
		} else {
			var tag_size = tags[t].length;

			tag_buffer.write(t.toString('ascii'), pos, 4, 'ascii');
			tag_buffer.write(tags[t].toString('ascii'), pos + 10, pos + 10 + tag_size);
			tag_buffer.writeUInt32BE(tag_size, pos + 4);
			tag_buffer.write('\u0000\u0000', pos + 8, pos + 10);

			pos += tag_size + 10;
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
		if (bit_pos % 8 == 0) {
			formatted_size[bit_pos] = 0;
			bit_pos++;
		}
		formatted_size[bit_pos] = appended_size[j];
		bit_pos++;
	}

	return parseInt(formatted_size.join(""), 2);
};

var tagGenerator = new TagGenerator();

module.exports = tagGenerator;