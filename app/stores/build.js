const _ = require('underscore');
const Reflux = require('reflux');
const BuildActions = require('../actions/build');
const resources = require('../resources');

const resource = resources.builds;

const Store = Reflux.createStore({
	listenables: BuildActions,
	build: null,

	onChange(data) {
		if (this.build && (data.buildId === this.build.id)) {
			_(this.build).extend(data.changes);
			this.trigger(this.build);
		}
	},

	init() {
		resource.subscribe('change', this.onChange);
	},

	onRead(id) {
		const self = this;
		resource.sync('read', {id}, (err, build) => {
			if (err) throw err;
			self.build = build;
			self.trigger(self.build);
		});
	}
});

module.exports = Store;
