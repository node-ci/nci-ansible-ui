'use strict';

var React = require('react'),
	_ = require('underscore'),
	template = require('./index.jade');

module.exports = React.createClass({
	render: template,
	componentDidMount: function() {
		var self = this;
		var updateCallback = function() {
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
	getInitialState: function() {
		return {};
	}
});
