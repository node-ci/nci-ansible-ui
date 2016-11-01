'use strict';

var React = require('react'),
	ReactDOM = require('react-dom'),
	App = require('./components/app'),
	ProjectView = require('./components/projects/view'),
	BuildView = require('./components/builds/view'),
	connect = require('./connect'),
	Router = require('react-router'),
	Route = React.createFactory(Router.Route);

var routes = (
	Route(
		{handler: App},
		Route({name: 'project', path: 'projects/:name', handler: ProjectView}),
		Route({name: 'build', path: 'builds/:id', handler: BuildView})
	)
);

connect.io.on('connect', function() {
	Router.run(routes, Router.HistoryLocation, function(Handler) {
		ReactDOM.render(
			React.createElement(Handler),
			document.getElementById('content')
		);
	});
});
