const _ = require('underscore');
const React = require('react');
const Router = require('react-router');
const Reflux = require('reflux');
const ansiUp = require('ansi_up');
const scrollTop = require('simple-scrolltop');
const BuildActions = require('../../../actions/build');
const ProjectActions = require('../../../actions/project');
const buildStore = require('../../../stores/build');
const projectStore = require('../../../stores/project');
const Terminal = require('../../terminal');
const BuildSidebar = require('./sidebar');
const CommonComponents = require('../../common');
const RevisionsItem = require('../../revisions/item');
const RevisionsList = require('../../revisions/list');
const template = require('./index.jade');

const Component = React.createClass({
	mixins: [Reflux.ListenerMixin, Router.Navigation],
	statics: {
		willTransitionTo(transition, params) {
			BuildActions.read(Number(params.id));
			// load builds for sidebar
			BuildActions.readAll();
		}
	},

	componentDidMount() {
		this.listenTo(buildStore, this.updateBuild);
		this.listenTo(projectStore, this.updateProject);
	},

	componentWillReceiveProps(nextProps) {
		// reset console status when go from build page to another build
		// page (did mount and mount not called in this case)
		if (Number(nextProps.params.id) !== this.state.build.id) {
			this.setState({showConsole: this.getInitialState().showConsole});
		}
	},

	updateBuild(build) {
		if (build && build.project) {
			// load project config
			if (
				_(this.state.project.name).isEmpty() ||
				this.state.project.name !== build.project.name
			) {
				ProjectActions.read({name: build.project.name});
			}
			this.setState({build});
		}
	},

	updateProject(project) {
		if (
			this.state.build &&
			this.state.build.project &&
			project &&
			project.name === this.state.build.project.name
		) {
			this.setState({project});
		}
	},

	getInitialState() {
		return {
			build: null,
			project: {},
			showConsole: false
		};
	},

	toggleConsole() {
		const consoleState = !this.state.showConsole;
		if (consoleState) {
			BuildActions.readTerminalOutput(this.state.build);
		}

		this.setState({showConsole: consoleState});

		// scroll to page top after hiding console
		if (!consoleState) {
			scrollTop(0);
		}
	},

	onRunAgain() {
		const {build} = this.state;
		if (build && build.project) {
			ProjectActions.run(build.project.name, build.params);
		}
		// TODO: go to last build in a durable way
		const self = this;
		setTimeout(() => {
			self.transitionTo('root');
		}, 500);
	},

	onRunProject() {
		this.transitionTo('projectRunForm');
	},

	render: template.locals(_({
		Terminal,
		RevisionsItem,
		RevisionsList,
		Link: Router.Link,
		BuildSidebar,
		_,
		ansiUp
	}).extend(CommonComponents))
});

module.exports = Component;
