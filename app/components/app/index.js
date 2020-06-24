const React = require('react');
const Router = require('react-router');
const template = require('./index.jade');

const Component = React.createClass({
	render() {
		return template({
			Link: Router.Link,
			RouteHandler: Router.RouteHandler
		});
	}
});

module.exports = Component;
