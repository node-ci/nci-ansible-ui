'use strict';

var _ = require('underscore'),
	errorHandler = require('./errorHandler'),
	helpers = require('./helpers');

module.exports = function(app) {
	_(['builds', 'projects']).each(function(resourceName) {
		var resource = require('./' + resourceName)(app);
		resource.use(errorHandler(app));
	});

	var buildsResource = app.dataio.resource('builds');

	app.builds.on('buildUpdated', function(build, changes) {
		if (build.status === 'queued') {
			helpers.createBuildDataResource(app, build.id);
		}

		// notify about build's project change, coz building affects project
		// related stat (last build date, avg build time, etc)
		if (changes.completed) {
			var projectsResource = app.dataio.resource('projects');
			projectsResource.clientEmitSyncChange(build.project.name);
		}

		buildsResource.clientEmitSync('change', {
			buildId: build.id,
			changes: changes
		});
	});

	app.builds.on('buildCanceled', function(build) {
		buildsResource.clientEmitSync('cancel', {
			buildId: build.id,
			buildStatus: build.status
		});
	});

	app.builds.on('buildLogLines', function(build, lines) {
		app.dataio.resource('build' + build.id).clientEmitSync(
			'data',
			{lines: lines}
		);
	});
};
