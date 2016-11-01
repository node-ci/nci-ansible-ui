'use strict';

var Reflux = require('reflux'),
	ProjectActions = require('../actions/project'),
	resource = require('../resources').projects;

var Store = Reflux.createStore({
	listenables: ProjectActions,
	onRun: function(projectName, buildParams) {
		resource.sync('run', {
			projectName: projectName,
			buildParams: buildParams
		}, function(err) {
			if (err) throw err;
		});
	},
	onReadAll: function(params) {
		var self = this;
		resource.sync('readAll', params, function(err, projects) {
			if (err) throw err;
			self.trigger(projects);
		});
	}
});

module.exports = Store;
