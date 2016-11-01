'use strict';

var _ = require('underscore'),
	Reflux = require('reflux'),
	BuildActions = require('../actions/build'),
	resources = require('../resources'),
	resource = resources.builds;

var Store = Reflux.createStore({
	listenables: BuildActions,
	builds: [],

	getInitialState: function() {
		return this.builds;
	},

	onChanged: function(data) {
		var oldBuild = _(this.builds).findWhere({id: data.buildId});
		if (oldBuild) {
			_(oldBuild).extend(data.changes);
		} else {
			this.builds.unshift(
				_({id: data.buildId}).extend(data.changes)
			);
		}

		this.trigger(this.builds);
	},

	onCancelled: function(data) {
		// WORKAROUND: client that trigger `onCancel` gets one `onCancelled`
		// call other clients get 2 calls (second with empty data)
		if (!data) {
			return;
		}

		if (data.buildStatus === 'queued') {
			var index = _(this.builds).findIndex({id: data.buildId});
			if (index !== -1) {
				this.builds.splice(index, 1);
			}

			this.trigger(this.builds);
		}
	},

	init: function() {
		resource.subscribe('change', this.onChanged);
		resource.subscribe('cancel', this.onCancelled);
	},

	onReadAll: function(params) {
		var self = this;
		resource.sync('readAll', params, function(err, builds) {
			if (err) throw err;
			self.builds = builds;
			self.trigger(self.builds);
		});
	},

	onCancel: function(buildId) {
		resource.sync('cancel', {buildId: buildId}, function(err) {
			if (err) throw err;
		});
	}
});

module.exports = Store;

