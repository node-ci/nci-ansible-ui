'use strict';

var React = require('react'),
	Router = require('react-router'),
	template = require('./index.jade');

var Component = React.createClass({
	render: function() {
		return template({
			Link: Router.Link,
			RouteHandler: Router.RouteHandler
		});
	}
});

module.exports = Component;
