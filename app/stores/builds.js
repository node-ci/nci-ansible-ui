const _ = require('underscore');
const Reflux = require('reflux');
const BuildActions = require('../actions/build');
const resources = require('../resources');

const resource = resources.builds;

const Store = Reflux.createStore({
	listenables: BuildActions,
	builds: [],

	getInitialState() {
		return this.builds;
	},

	onChanged(data) {
		const oldBuild = _(this.builds).findWhere({id: data.buildId});
		if (oldBuild) {
			_(oldBuild).extend(data.changes);
		} else {
			this.builds.unshift(
				_({id: data.buildId}).extend(data.changes)
			);
		}

		this.trigger(this.builds);
	},

	onCancelled(data) {
		// WORKAROUND: client that trigger `onCancel` gets one `onCancelled`
		// call other clients get 2 calls (second with empty data)
		if (!data) {
			return;
		}

		if (data.buildStatus === 'queued') {
			const index = _(this.builds).findIndex({id: data.buildId});
			if (index !== -1) {
				this.builds.splice(index, 1);
			}

			this.trigger(this.builds);
		}
	},

	init() {
		resource.subscribe('change', this.onChanged);
		resource.subscribe('cancel', this.onCancelled);
	},

	onReadAll(params) {
		const self = this;
		resource.sync('readAll', params, (err, builds) => {
			if (err) throw err;
			self.builds = builds;
			self.trigger(self.builds);
		});
	},

	onCancel(buildId) {
		resource.sync('cancel', {buildId}, (err) => {
			if (err) throw err;
		});
	}
});

module.exports = Store;
