'use strict';

var _ = require('underscore'),
	React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	BuildActions = require('../../../actions/build'),
	ProjectActions = require('../../../actions/project'),
	buildStore = require('../../../stores/build'),
	Terminal = require('../../terminal'),
	BuildSidebar = require('./sidebar'),
	CommonComponents = require('../../common'),
	RevisionsItem = require('../../revisions/item'),
	RevisionsList = require('../../revisions/list'),
	template = require('./index.jade'),
	ansiUp = require('ansi_up');

var Component = React.createClass({
	mixins: [Reflux.ListenerMixin, Router.Navigation],
	statics: {
		willTransitionTo: function(transition, params) {
			BuildActions.read(Number(params.id));
			// load builds for sidebar
			BuildActions.readAll();
		}
	},

	componentDidMount: function() {
		this.listenTo(buildStore, this.updateBuild);
	},

	componentWillReceiveProps: function(nextProps) {
		// reset console status when go from build page to another build
		// page (did mount and mount not called in this case)
		if (Number(nextProps.params.id) !== this.state.build.id) {
			this.setState({showConsole: this.getInitialState().showConsole});
		}
	},

	updateBuild: function(build) {
		this.setState({build: build});
	},

	getInitialState: function() {
		return {
			build: null,
			project: {},
			showConsole: false
		};
	},

	getBody: function() {
		return document.getElementsByTagName('body')[0];
	},

	toggleConsole: function() {
		var consoleState = !this.state.showConsole;
		if (consoleState) {
			BuildActions.readTerminalOutput(this.state.build);
		}

		this.setState({showConsole: consoleState});

		// scroll to page top after hiding console
		if (!consoleState) {
			this.getBody().scrollTop = 0;
		}
	},

	onRunAgain: function() {
		var build = this.state.build;
		ProjectActions.run(build.project.name, build.params);

		// TODO: go to last build in a durable way
		var self = this;
		setTimeout(function() {
			self.transitionTo('root');
		}, 500);
	},

	onRunProject: function() {
		this.transitionTo('projectRunForm');
	},

	render: template.locals(_({
		Terminal: Terminal,
		RevisionsItem: RevisionsItem,
		RevisionsList: RevisionsList,
		Link: Router.Link,
		BuildSidebar: BuildSidebar,
		_: _,
		ansiUp: ansiUp
	}).extend(CommonComponents))
});

module.exports = Component;
