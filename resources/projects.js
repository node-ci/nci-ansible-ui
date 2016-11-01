'use strict';

var Steppy = require('twostep').Steppy,
	_ = require('underscore'),
	helpers = require('./helpers');

module.exports = function(app) {
	var logger = app.lib.logger('projects resource'),
		resource = app.dataio.resource('projects');

	resource.use('createBuildDataResource', function(req, res) {
		helpers.createBuildDataResource(app, req.data.buildId);
		res.send();
	});

	resource.use('readAll', function(req, res) {
		var filteredProjects = app.projects.getAll(),
			nameQuery = req.data && req.data.nameQuery;

		if (nameQuery) {
			filteredProjects = app.projects.filter(function(project) {
				return project.name.indexOf(nameQuery) !== -1;
			});
		}

		filteredProjects = _(filteredProjects).sortBy('name');

		res.send(filteredProjects);
	});

	// get project with additional fields
	var getProject = function(name, callback) {
		var project;
		Steppy(
			function() {
				project = _(app.projects.get(name)).clone();

				app.builds.getRecent({
					projectName: project.name,
					status: 'done',
					limit: 10
				}, this.slot());

				app.builds.getDoneStreak({projectName: project.name}, this.slot());
			},
			function(err, doneBuilds, doneBuildsStreak) {
				project.avgBuildDuration = app.builds.getAvgBuildDuration(doneBuilds);
				project.lastDoneBuild = doneBuilds[0];
				project.doneBuildsStreak = doneBuildsStreak;

				this.pass(project);
			},
			callback
		);
	};

	// resource custom method which finds project by name
	// and emits event about it change to clients
	resource.clientEmitSyncChange = function(name) {
		Steppy(
			function() {
				getProject(name, this.slot());
			},
			function(err, project) {
				resource.clientEmitSync('change', {project: project});
			},
			function(err) {
				console.error(
					'Error during sync project change occurred:',
					err.stack || err
				);
			}
		);
	};

	resource.use('read', function(req, res) {
		Steppy(
			function() {
				getProject(req.data.name, this.slot());
			},
			function(err, project) {
				res.send(project);
			}
		);
	});

	resource.use('run', function(req, res) {
		var projectName = req.data.projectName,
			buildParams = req.data.buildParams;

		logger.log('Run the project: "%s"', projectName);

		app.builds.create({
			projectName: projectName,
			initiator: {type: 'user'},
			queueQueued: true,
			buildParams: buildParams
		});

		res.send();
	});

	return resource;
};
