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
	onProjectChange: function(event) {
		this.setState({projectName: event.target.value});
	},
	onScmBranchChange: function(event) {
		this.setState({scmBranch: event.target.value});
	},
	onRunProject: function() {
		ProjectActions.run(this.state.projectName);
	},
	render: template.locals({
		_: _
	})
});
