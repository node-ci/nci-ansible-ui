'use strict';

module.exports = function(app) {
	var logger = app.lib.logger('resources error handler');

	return function(err, req, res, next) {
		logger.error(
			'Error is occurred during requesting ' +
			req.resource.namespace.name + ' ' + req.action + ':',
			err.stack || err
		);
	};
};
