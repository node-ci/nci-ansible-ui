'use strict';

var Steppy = require('twostep').Steppy;

var buildDataResourcesHash = {};

// create resource for build data
exports.createBuildDataResource = function(app, buildId) {
	if (buildId in buildDataResourcesHash) {
		return;
	}
	var buildDataResource = app.dataio.resource('build' + buildId);
	buildDataResource.on('connection', function(client) {
		var callback = this.async();
		Steppy(
			function() {
				app.builds.getLogLines({buildId: buildId}, this.slot());
			},
			function(err, logLinesData) {
				client.emit('sync', 'data', {lines: logLinesData.lines});

				this.pass(null);
			},
			function(err) {
				if (err) {
					var logger = app.lib.logger('create build resource');
					logger.error(
						'error during read log for "' + buildId + '":',
						err.stack || err
					);
				}
				callback();
			}
		);
	});
	buildDataResourcesHash[buildId] = buildDataResource;
};
