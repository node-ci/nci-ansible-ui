const _ = require('underscore');
const errorHandler = require('./errorHandler');
const helpers = require('./helpers');

module.exports = function (app) {
	_(['builds', 'projects']).each((resourceName) => {
		// eslint-disable-next-line import/no-dynamic-require
		const resource = require(`./${resourceName}`)(app);
		resource.use(errorHandler(app));
	});

	const buildsResource = app.dataio.resource('builds');

	app.builds.on('buildUpdated', (build, changes) => {
		if (build.status === 'queued') {
			helpers.createBuildDataResource(app, build.id);
		}

		// notify about build's project change, coz building affects project
		// related stat (last build date, avg build time, etc)
		if (changes.completed) {
			const projectsResource = app.dataio.resource('projects');
			projectsResource.clientEmitSyncChange(build.project.name);
		}

		buildsResource.clientEmitSync('change', {
			buildId: build.id,
			changes
		});
	});

	app.builds.on('buildCanceled', (build) => {
		buildsResource.clientEmitSync('cancel', {
			buildId: build.id,
			buildStatus: build.status
		});
	});

	app.builds.on('buildLogLines', (build, lines) => {
		app.dataio.resource(`build${build.id}`).clientEmitSync(
			'data',
			{lines}
		);
	});
};
