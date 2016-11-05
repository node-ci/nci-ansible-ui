'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	BuildActions = require('../../actions/build'),
	buildsStore = require('../../stores/builds');

module.exports = React.createClass({
	mixins: [Reflux.ListenerMixin, Router.Navigation],
	componentDidMount: function() {
		this.listenTo(buildsStore, this.navigateToBuild);
		BuildActions.readAll({limit: 1});
	},
	navigateToBuild: function(builds) {
		this.transitionTo('build', {id: builds[0].id});
	},
	// dummy render method, coz no view needed
	render: function() {
		return React.createElement('div');
	}
});
