const Reflux = require('reflux');
const ProjectActions = require('../actions/project');
const resources = require('../resources');

const resource = resources.projects;

const Store = Reflux.createStore({
	listenables: ProjectActions,
	project: {},

	getInitialState() {
		return this.project;
	},

	onChange(data) {
		this.trigger(data.project);
	},

	init() {
		resource.subscribe('change', this.onChange);
	},

	onRead(params) {
		const self = this;
		resource.sync('read', params, (err, project) => {
			if (err) throw err;
			self.project = project;
			self.trigger(self.project);
		});
	}
});

module.exports = Store;
