'use strict';

var React = require('react'),
	Router = require('react-router'),
	ProjectActions = require('../../actions/project'),
	template = require('./index.jade');

var Component = React.createClass({
	componentDidMount: function() {
		ProjectActions.readAll();
	},
	render: function() {
		return template({
			Link: Router.Link,
			RouteHandler: Router.RouteHandler
		});
	}
});

module.exports = Component;
