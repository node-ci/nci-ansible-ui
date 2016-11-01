'use strict';

var React = require('react'),
	template = require('./index.jade'),
	RevisionsItem = require('../../revisions/item');

module.exports = React.createClass({
	onShowMoreRevisions: function() {
		this.setState({
			limit: this.state.limit + this.getInitialState().limit
		});
	},
	componentWillReceiveProps: function(nextProps) {
		// reset limit when go from build page to another build
		// page (did mount and mount not called in this case)
		if (nextProps.revisions.length !== this.props.revisions.length) {
			this.setState({limit: this.getInitialState().limit});
		}
	},
	getInitialState: function() {
		return {limit: 20};
	},
	render: template.locals({
		RevisionsItem: RevisionsItem
	})
});
