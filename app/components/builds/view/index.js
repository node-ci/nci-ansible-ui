'use strict';

var _ = require('underscore'),
	React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	BuildActions = require('../../../actions/build'),
	buildStore = require('../../../stores/build'),
	Terminal = require('../../terminal'),
	BuildSidebar = require('./sidebar'),
	CommonComponents = require('../../common'),
	RevisionsItem = require('../../revisions/item'),
	RevisionsList = require('../../revisions/list'),
	ProjectHeader = require('../../projects/header'),
	ProjectActions = require('../../../actions/project'),
	projectStore = require('../../../stores/project'),
	template = require('./index.jade'),
	ansiUp = require('ansi_up');

var Component = React.createClass({
	mixins: [Reflux.ListenerMixin],
	statics: {
		willTransitionTo: function(transition, params) {
			BuildActions.read(Number(params.id));
		}
	},

	componentDidMount: function() {
		this.listenTo(buildStore, this.updateBuild);
		this.listenTo(projectStore, this.updateProject);
	},

	componentWillReceiveProps: function(nextProps) {
		// reset console status when go from build page to another build
		// page (did mount and mount not called in this case)
		if (Number(nextProps.params.id) !== this.state.build.id) {
			this.setState({showConsole: this.getInitialState().showConsole});
		}
	},

	updateBuild: function(build) {
		if (build) {
			BuildActions.readAll();
			// load project config for showing it at project header
			if (
				_(this.state.project.name).isEmpty() ||
				this.state.project.name !== build.project.name
			) {
				ProjectActions.read({name: build.project.name});
			}
		}
		this.setState({build: build});
	},

	updateProject: function(project) {
		if (project.name === this.state.build.project.name) {
			this.setState({project: project});
		}
	},

	getInitialState: function() {
		return {
			build: null,
			project: {},
			showConsole: false
		};
	},

	toggleConsole: function() {
		var consoleState = !this.state.showConsole;
		if (consoleState) {
			BuildActions.readTerminalOutput(this.state.build);
		}
		this.setState({showConsole: consoleState});
	},

	render: template.locals(_({
		Terminal: Terminal,
		RevisionsItem: RevisionsItem,
		RevisionsList: RevisionsList,
		Link: Router.Link,
		BuildSidebar: BuildSidebar,
		ProjectHeader: ProjectHeader,
		_: _,
		ansiUp: ansiUp
	}).extend(CommonComponents))
});

module.exports = Component;
