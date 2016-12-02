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

		// disconnect from all previously connected resources
		_(self.connectedResourcesHash).each(function(resource) {
			resource.disconnect();
		});

		var connectToBuildDataResource = function() {
			var resource = self.connectedResourcesHash[resourceName];
			// reconnect for get data below (at subscribe), coz
			// data emitted only once during connect
			if (resource) {
				resource.reconnect();
			} else {
				resource = connect.resource(resourceName);
				self.connectedResourcesHash[resourceName] = resource;
			}

			resource.subscribe('data', function(data) {
				var lastLine = _(self.lines).last();
				if (lastLine && (_(data.lines).first().number === lastLine.number)) {
					self.lines = _(self.lines).initial();
				}
				self.lines = self.lines.concat(data.lines);
				self.trigger({
					buildId: build.id,
					buildCompleted: build.completed,
					name: 'Console for build #' + build.id,
					data: _(self.lines).chain().pluck('text').map(function(text) {
						// TODO: this can break output of non-ansible projects
						// prettify ansible output - unescape linebreaks and quotes
						return text.replace(/\\n/g, '\n').replace(/\\"/g, '');
					}).value()
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
