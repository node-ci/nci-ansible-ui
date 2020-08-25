const React = require('react');
const Router = require('react-router');
const Reflux = require('reflux');
const BuildActions = require('../../actions/build');
const buildsStore = require('../../stores/builds');

module.exports = React.createClass({
	mixins: [Reflux.ListenerMixin, Router.Navigation],
	componentDidMount() {
		this.listenTo(buildsStore, this.navigateToBuild);
		BuildActions.readAll({limit: 1});
	},
	navigateToBuild(builds) {
		if (builds.length) {
			this.transitionTo('build', {id: builds[0].id});
		} else {
			this.transitionTo('projectRunForm');
		}
	},
	// dummy render method, coz no view needed
	render() {
		return React.createElement('div');
	}
});
