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
			scmRev: '',
			playbookName: '',
			inventoryNames: [],
			limit: '',
			extraVars: ''
		});
	},
	onScmBranchChange: function(event) {
		this.setState({scmBranch: event.target.value});
	},
	onScmRevChange: function(event) {
		this.setState({scmRev: event.target.value});
	},
	onPlaybookNameChange: function(event) {
		this.setState({
			playbookName: event.target.value,
			inventoryNames: [],
			limit: '',
			extraVars: ''
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
	onExtraVarsChange: function(event) {
		this.setState({extraVars: event.target.value});
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

			if (this.state.extraVars) {
				buildParams.playbook.extraVars = this.state.extraVars;
			}
		}

		var project = _(this.state.projects).findWhere({
			name: this.state.projectName
		});

		var scmBranch = this.state.scmBranch,
			scmRev = scmBranch === '-1' ? this.state.scmRev : scmBranch,
			projectScmRev = project.scm ? project.scm.rev : '';

		if (scmRev && scmRev !== projectScmRev) {
			buildParams.scmRev = scmRev;
		}

		ProjectActions.run(project.name, buildParams);

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
