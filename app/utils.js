'use strict';

exports.prune = function(str, length) {
	var result = '',
		words = str.split(' ');

	do {
		result += words.shift() + ' ';
	} while (words.length && result.length < length);

	return result.replace(/ $/, words.length ? '...' : '');
};

exports.escapeHtml = function(str) {
	return str
		.replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};
