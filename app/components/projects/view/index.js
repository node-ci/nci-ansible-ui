'use strict';

var ProjectHeader = require('../header'),
	React = require('react'),
	Reflux = require('reflux'),
	ProjectActions = require('../../../actions/project'),
	BuildActions = require('../../../actions/build'),
	projectStore = require('../../../stores/project'),
	Builds = require('../../builds/list'),
	CommonComponents = require('../../common'),
	template = require('./index.jade');

module.exports = React.createClass({
	mixins: [
		Reflux.connectFilter(projectStore, 'project', function(project) {
			if (project.name === this.props.params.name) {
				return project;
			} else {
				if (this.state) {
					return this.state.project;
				} else {
					return projectStore.getInitialState();
				}
			}
		})
	],
	statics: {
		willTransitionTo: function(transition, params) {
			ProjectActions.read({name: params.name});
			BuildActions.readAll({projectName: params.name});
		}
	},
	render: template.locals({
		ProjectHeader: ProjectHeader,
		Builds: Builds,
		DateTime: CommonComponents.DateTime,
		Duration: CommonComponents.Duration
	})
});
