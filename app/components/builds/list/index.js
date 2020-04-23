'use strict';

var _ = require('underscore'),
	React = require('react'),
	Reflux = require('reflux'),
	Item = require('../item'),
	BuildActions = require('../../../actions/build'),
	buildsStore = require('../../../stores/builds'),
	template = require('./index.jade');

var Component = React.createClass({
	mixins: [
		Reflux.connectFilter(buildsStore, 'items', function(items) {
			var projectName = this.props.projectName;
			if (projectName) {
				return _(items).filter(function(item) {
					return item.project && item.project.name === projectName;
				});
			} else {
				return items;
			}
		})
	],
	onShowMoreBuilds: function(projectName) {
		BuildActions.readAll({
			projectName: projectName,
			limit: this.state.items.length + 20
		});
	},
	render: template.locals({
		Item: Item
	})
});

module.exports = Component;
