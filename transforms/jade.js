const through = require('through');
const jade = require('react-jade');

module.exports = (fileName, options) => {
	if (!/\.jade$/i.test(fileName)) {
		return through();
	}

	let template = '';
	return through(
		(chunk) => {
			template += chunk.toString();
		},
		function end() {
			options.filename = fileName;
			options.globalReact = true;

			try {
				template = jade.compileClient(template, options);
			} catch (e) {
				this.emit('error', e);
				return;
			}

			const moduleBody = `${'var React = require("react");\n' +
				'module.exports = '}${template}`;

			this.queue(moduleBody);
			this.queue(null);
		}
	);
};
