'use strict';

var _ = require('underscore'),
	React = require('react'),
	Router = require('react-router'),
	ProjectActions = require('../../../actions/project'),
	BuildActions = require('../../../actions/build'),
	CommonComponents = require('../../common'),
	utils = require('../../../utils'),
	template = require('./index.jade');

var Component = React.createClass({
	onRebuildProject: function(projectName) {
		ProjectActions.run(projectName);
	},
	onCancelBuild: function(buildId) {
		BuildActions.cancel(buildId);
	},
	render: template.locals(_({
		Link: Router.Link,
		utils: utils
	}).extend(CommonComponents))
});

module.exports = Component;
