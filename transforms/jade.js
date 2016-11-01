'use strict';

var through = require('through'),
	jade = require('react-jade');

module.exports = function(fileName, options) {
	if (!/\.jade$/i.test(fileName)) {
		return through();
	}

	var template = '';
	return through(
		function(chunk) {
			template += chunk.toString();
		},
		function() {
			options.filename = fileName;
			options.globalReact = true;

			try {
				template = jade.compileClient(template, options);
			} catch (e) {
				this.emit('error', e);
				return;
			}

			var moduleBody = 'var React = require("react");\n' +
				'module.exports = ' + template;

			this.queue(moduleBody);
			this.queue(null);
		}
	);
};
