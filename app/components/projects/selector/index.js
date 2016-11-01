'use strict';

var React = require('react'),
	ReactDOM = require('react-dom'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	CommonComponents = require('../../common'),
	ProjectActions = require('../../../actions/project'),
	projectsStore = require('../../../stores/projects'),
	template = require('./index.jade');

module.exports = React.createClass({
	mixins: [Reflux.ListenerMixin, Router.Navigation],
	componentDidMount: function() {
		this.listenTo(projectsStore, this.updateItems);
	},
	getInitialState: function() {
		return {
			showSearch: false
		};
	},
	onRunProject: function(projectName) {
		ProjectActions.run(projectName);
		this.setState({showSearch: false});
	},
	onSelectProject: function(name) {
		this.transitionTo('project', {name: name});
	},
	updateItems: function(projects) {
		this.setState({projects: projects});
	},
	onSearchProject: function() {
		this.setState({showSearch: true});
	},
	onInputMount: function(component) {
		var node = ReactDOM.findDOMNode(component);
		if (node) {
			node.focus();
		}
	},
	onBlurSearch: function() {
		this.setState({showSearch: false});
	},
	onSearchChange: function(event) {
		var query = event.target.value;
		this.setState({searchQuery: query});
		ProjectActions.readAll({nameQuery: query});
	},
	render: template.locals({
		Link: Router.Link,
		Scm: CommonComponents.Scm
	})
});
