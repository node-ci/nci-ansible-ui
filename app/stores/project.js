'use strict';

var Reflux = require('reflux'),
	ProjectActions = require('../actions/project'),
	resources = require('../resources'),
	resource = resources.projects;

var Store = Reflux.createStore({
	listenables: ProjectActions,
	project: {},

	getInitialState: function() {
		return this.project;
	},

	onChange: function(data) {
		this.trigger(data.project);
	},

	init: function() {
		resource.subscribe('change', this.onChange);
	},

	onRead: function(params) {
		var self = this;
		resource.sync('read', params, function(err, project) {
			if (err) throw err;
			self.project = project;
			self.trigger(self.project);
		});
	}
});

module.exports = Store;
