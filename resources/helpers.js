const {Steppy} = require('twostep');

const buildDataResourcesHash = {};

// create resource for build data
exports.createBuildDataResource = function (app, buildId) {
	if (buildId in buildDataResourcesHash) {
		return;
	}
	const buildDataResource = app.dataio.resource(`build${buildId}`);
	buildDataResource.on('connection', function (client) {
		const callback = this.async();
		Steppy(
			function () {
				app.builds.getLogLines({buildId}, this.slot());
			},
			function (err, logLinesData) {
				client.emit('sync', 'data', {lines: logLinesData.lines});

				this.pass(null);
			},
			(err) => {
				if (err) {
					const logger = app.lib.logger('create build resource');
					logger.error(
						`error during read log for "${buildId}":`,
						err.stack || err
					);
				}
				callback();
			}
		);
	});
	buildDataResourcesHash[buildId] = buildDataResource;
};
