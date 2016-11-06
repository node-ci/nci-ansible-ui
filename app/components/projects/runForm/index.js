'use strict';

var React = require('react'),
	Reflux = require('reflux'),
	Router = require('react-router'),
	ProjectActions = require('../../../actions/project'),
	projectsStore = require('../../../stores/projects'),
	template = require('./index.jade'),
	_ = require('underscore');

require('../../../stores/projects');

module.exports = React.createClass({
	mixins: [
		Reflux.connect(projectsStore, 'projects'),
		Router.Navigation
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
			inventoryNames: [],
			limit: ''
		});
	},
	onScmBranchChange: function(event) {
		this.setState({scmBranch: event.target.value});
	},
	onPlaybookNameChange: function(event) {
		this.setState({
			playbookName: event.target.value,
			inventoryNames: [],
			limit: ''
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
	onUnselectAllInventoryNames: function() {
		this.setState({inventoryNames: []});
	},
	onSelectAllInventoryNames: function() {
		var project = _(this.state.projects).findWhere({
			name: this.state.projectName
		});
		var playbook = _(project.playbooks).findWhere({
			name: this.state.playbookName
		});
		this.setState({inventoryNames: _(playbook.inventories).pluck('name')});
	},
	onLimitChange: function(event) {
		this.setState({limit: event.target.value});
	},
	onCancel: function() {
		this.transitionTo('root');
	},
	onRunProject: function() {
		var buildParams = {};
		if (this.state.playbookName) {
			buildParams.playbook = {
				name: this.state.playbookName,
				inventoryNames: this.state.inventoryNames
			};

			if (this.state.limit) {
				buildParams.playbook.limit = this.state.limit;
			}
		}
		ProjectActions.run(this.state.projectName, buildParams);

		// TODO: go to last build in a durable way
		var self = this;
		setTimeout(function() {
			self.transitionTo('root');
		}, 500);
	},
	render: template.locals({
		_: _
	})
});
