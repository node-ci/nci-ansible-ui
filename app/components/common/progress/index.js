const React = require('react');
const _ = require('underscore');
const template = require('./index.jade');

module.exports = React.createClass({
	render: template,
	componentDidMount() {
		const self = this;
		const updateCallback = function () {
			if (self.props.build.status === 'in-progress') {
				if (self.isMounted()) {
					self.setState({
						duration: Date.now() - self.props.build.startDate,
						avgDuration: self.props.build.project.avgBuildDuration
					});
					_.delay(updateCallback, 100);
				}
			}
		};

		updateCallback();
	},
	getInitialState() {
		return {};
	}
});
