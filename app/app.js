const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const App = require('./components/app');
const RootView = require('./components/root');
const ProjectRunForm = require('./components/projects/runForm');
const BuildView = require('./components/builds/view');
const connect = require('./connect');

const Route = React.createFactory(Router.Route);

const routes = (
	Route(
		{handler: App},
		Route({
			name: 'projectRunForm',
			path: 'projects/run',
			handler: ProjectRunForm
		}),
		Route({name: 'root', path: '/', handler: RootView}),
		Route({name: 'build', path: 'builds/:id', handler: BuildView})
	)
);

connect.io.on('connect', () => {
	Router.run(routes, Router.HistoryLocation, (Handler) => {
		ReactDOM.render(
			React.createElement(Handler),
			document.getElementById('content')
		);
	});
});
