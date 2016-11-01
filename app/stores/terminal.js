'use strict';

var _ = require('underscore'),
	Reflux = require('reflux'),
	BuildActions = require('../actions/build'),
	connect = require('../connect').data;

var Store = Reflux.createStore({
	listenables: BuildActions,

	init: function() {
		// the only purpose of this hash to reconnect all the time
		// except first, see notes at using
		this.connectedResourcesHash = {};
	},

	onReadTerminalOutput: function(build) {
		var self = this,
			resourceName = 'build' + build.id;

		var connectToBuildDataResource = function() {
			// reconnect for get data below (at subscribe), coz
			// data emitted only once during connect
			if (self.connectedResourcesHash[resourceName]) {
				connect.resource(resourceName).reconnect();
			} else {
				self.connectedResourcesHash[resourceName] = 1;
			}

			connect.resource(resourceName).subscribe('data', function(data) {
				var lastLine = _(self.lines).last();
				if (lastLine && (_(data.lines).first().number === lastLine.number)) {
					self.lines = _(self.lines).initial();
				}
				self.lines = self.lines.concat(data.lines);
				self.trigger({
					buildId: build.id,
					buildCompleted: build.completed,
					name: 'Console for build #' + build.id,
					data: _(self.lines).pluck('text')
				});
			});
		};

		this.lines = [];
		this.currentLine = '';

		// create data resource for completed build
		if (build.completed) {
			connect.resource('projects').sync(
				'createBuildDataResource',
				{buildId: build.id},
				function(err) {
					if (err) throw err;
					connectToBuildDataResource();
				}
			);
		} else {
			connectToBuildDataResource();
		}
	}
});

module.exports = Store;
