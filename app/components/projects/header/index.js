'use strict';

var React = require('react'),
	ProjectActions = require('../../../actions/project'),
	template = require('./index.jade'),
	CommonComponents = require('../../common');

require('../../../stores/projects');

module.exports = React.createClass({
	getInitialState: function() {
		return {};
	},
	onScmBranchChange: function(event) {
		this.setState({scmBranch: event.target.value});
	},
	onScmRevChange: function(event) {
		this.setState({scmRev: event.target.value});
	},
	onBuildProject: function() {
		if (this.props.project.name) {
			var buildParams = {};

			var scmBranch = this.state.scmBranch,
				scmRev = scmBranch === '-1' ? this.state.scmRev : scmBranch,
				projectScmRev = (
					this.props.project.scm ? this.props.project.scm.rev : ''
				);

			if (scmRev && scmRev !== projectScmRev) {
				buildParams.scmRev = scmRev;
			}

			ProjectActions.run(this.props.project.name, buildParams);
		}
	},
	render: template.locals({
		Scm: CommonComponents.Scm
	})
});
