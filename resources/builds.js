const {Steppy} = require('twostep');
const _ = require('underscore');

module.exports = function (app) {
	const logger = app.lib.logger('builds resource');
	const resource = app.dataio.resource('builds');

	resource.use('readAll', (req, res, next) => {
		Steppy(
			function () {
				const data = req.data || {};
				const getParams = {limit: Number(data.limit) || 20};

				if (data.projectName) {
					getParams.projectName = data.projectName;
				}

				app.builds.getRecent(getParams, this.slot());
			},
			(err, builds) => {
				// omit big fields not needed for list
				_(builds).each((build) => {
					delete build.stepTimings;
					if (build.scm) {
						delete build.scm.changes;
					}
					build.project = _(build.project).pick(
						'name', 'scm', 'avgBuildDuration'
					);
				});

				res.send(builds);
			},
			next
		);
	});

	resource.use('read', (req, res, next) => {
		Steppy(
			function () {
				app.builds.get(req.data.id, this.slot());
			},
			(err, build) => {
				res.send(build);
			},
			next
		);
	});

	resource.use('getBuildLogTail', (req, res, next) => {
		Steppy(
			function () {
				app.builds.getLogLinesTail({
					buildId: req.data.buildId,
					limit: req.data.length
				}, this.slot());
			},
			(err, tail) => {
				res.send(tail);
			},
			next
		);
	});

	resource.use('getBuildLogLines', (req, res, next) => {
		Steppy(
			function () {
				app.builds.getLogLines(
					_(req.data).pick('buildId', 'from', 'to'),
					this.slot()
				);
			},
			(err, logLinesData) => {
				res.send(logLinesData);
			},
			next
		);
	});

	resource.use('cancel', (req, res, next) => {
		Steppy(
			function () {
				const {buildId} = req.data;
				logger.log('Cancel build: "%s"', buildId);
				app.builds.cancel({
					buildId,
					canceledBy: {type: 'user'}
				}, this.slot());
			},
			() => {
				res.send();
			},
			next
		);
	});

	return resource;
};
