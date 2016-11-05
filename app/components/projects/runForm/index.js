'use strict';

var React = require('react'),
	Reflux = require('reflux'),
	ProjectActions = require('../../../actions/project'),
	projectsStore = require('../../../stores/projects'),
	template = require('./index.jade'),
	_ = require('underscore');

require('../../../stores/projects');

module.exports = React.createClass({
	mixins: [
		Reflux.connect(projectsStore, 'projects')
	],
	statics: {
		willTransitionTo: function() {
			ProjectActions.readAll();
		}
	},
	onProjectNameChange: function(event) {
		this.setState({
			projectName: event.target.value,
			playbookName: '',
			inventoryNames: []
		});
	},
	onScmBranchChange: function(event) {
		this.setState({scmBranch: event.target.value});
	},
	onPlaybookNameChange: function(event) {
		this.setState({
			playbookName: event.target.value,
			inventoryNames: []
		});
	},
	onInventoryNamesChange: function(event) {
		var input = event.target,
			inventoryName = input.value;

		var inventoryNames = this.state.inventoryNames || [];

		if (input.checked) {
			inventoryNames.push(inventoryName);
		} else {
			var index = inventoryNames.indexOf(inventoryName);
			if (index !== -1) {
				inventoryNames.splice(index, 1);
			}
		}

		this.setState({inventoryNames: inventoryNames});
	},
	onRunProject: function() {
		var buildParams = {};
		if (this.state.playbookName) {
			buildParams.playbookName = this.state.playbookName;
			buildParams.inventoryNames = this.state.inventoryNames;
		}
		ProjectActions.run(this.state.projectName, buildParams);
	},
	render: template.locals({
		_: _
	})
});
