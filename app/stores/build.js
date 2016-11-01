'use strict';

var _ = require('underscore'),
	Reflux = require('reflux'),
	BuildActions = require('../actions/build'),
	resources = require('../resources'),
	resource = resources.builds;

var Store = Reflux.createStore({
	listenables: BuildActions,
	build: null,

	onChange: function(data) {
		if (this.build && (data.buildId === this.build.id)) {
			_(this.build).extend(data.changes);
			this.trigger(this.build);
		}
	},

	init: function() {
		resource.subscribe('change', this.onChange);
	},

	onRead: function(id) {
		var self = this;
		resource.sync('read', {id: id}, function(err, build) {
			if (err) throw err;
			self.build = build;
			self.trigger(self.build);
		});
	}
});

module.exports = Store;
