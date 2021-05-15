const Reflux = require('reflux');
const ProjectActions = require('../actions/project');
const resource = require('../resources').projects;

const Store = Reflux.createStore({
	listenables: ProjectActions,
	onRun(projectName, buildParams) {
		resource.sync('run', {
			projectName,
			buildParams
		}, (err) => {
			if (err) throw err;
		});
	},
	onReadAll(params) {
		const self = this;
		resource.sync('readAll', params, (err, projects) => {
			if (err) throw err;
			self.trigger(projects);
		});
	}
});

module.exports = Store;
