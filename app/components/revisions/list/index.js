const React = require('react');
const template = require('./index.jade');
const RevisionsItem = require('../item');

module.exports = React.createClass({
	onShowMoreRevisions() {
		this.setState({
			limit: this.state.limit + this.getInitialState().limit
		});
	},
	componentWillReceiveProps(nextProps) {
		// reset limit when go from build page to another build
		// page (did mount and mount not called in this case)
		if (nextProps.revisions.length !== this.props.revisions.length) {
			this.setState({limit: this.getInitialState().limit});
		}
	},
	getInitialState() {
		return {limit: 20};
	},
	render: template.locals({
		RevisionsItem
	})
});
