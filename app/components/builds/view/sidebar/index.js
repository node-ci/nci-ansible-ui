'use strict';

var _ = require('underscore'),
	React = require('react'),
	Reflux = require('reflux'),
	Router = require('react-router'),
	buildsStore = require('../../../../stores/builds'),
	template = require('./index.jade'),
	CommonComponents = require('../../../common'),
	BuildActions = require('../../../../actions/build');

module.exports = React.createClass({
	mixins: [
		Reflux.connect(buildsStore, 'items')
	],
	onCancelBuild: function(buildId) {
		BuildActions.cancel(buildId);
	},
	render: template.locals(_({
		Link: Router.Link
	}).extend(CommonComponents))
});
