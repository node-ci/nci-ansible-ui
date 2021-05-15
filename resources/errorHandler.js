module.exports = function (app) {
	const logger = app.lib.logger('resources error handler');

	// eslint-disable-next-line no-unused-vars
	return function (err, req, res, next) {
		logger.error(
			`Error is occurred during requesting ${
				req.resource.namespace.name} ${req.action}:`,
			err.stack || err
		);
	};
};
