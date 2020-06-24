const Reflux = require('reflux');
const BuildLogActions = require('../actions/buildLog');
const resources = require('../resources');

const resource = resources.builds;

const Store = Reflux.createStore({
	listenables: BuildLogActions,
	data: {
		lines: [],
		total: 0
	},

	getInitialState() {
		return this.data;
	},

	onGetTail(params) {
		const self = this;
		resource.sync('getBuildLogTail', params, (err, data) => {
			if (err) throw err;
			self.data = data;
			self.trigger(self.data);
		});
	},

	onGetLines(params) {
		const self = this;
		resource.sync('getBuildLogLines', params, (err, data) => {
			if (err) throw err;
			self.data.lines = data.lines;
			self.trigger(self.data);
		});
	}
});

module.exports = Store;
