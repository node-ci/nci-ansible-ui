const _ = require('underscore');
const React = require('react');
const Reflux = require('reflux');
const Router = require('react-router');
const buildsStore = require('../../../../stores/builds');
const template = require('./index.jade');
const CommonComponents = require('../../../common');
const BuildActions = require('../../../../actions/build');

module.exports = React.createClass({
	mixins: [
		Reflux.connect(buildsStore, 'items')
	],
	onCancelBuild(buildId) {
		BuildActions.cancel(buildId);
	},
	render: template.locals(_({
		Link: Router.Link
	}).extend(CommonComponents))
});
