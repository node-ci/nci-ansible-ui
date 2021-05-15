const _ = require('underscore');
const Reflux = require('reflux');
const BuildActions = require('../actions/build');
const connect = require('../connect').data;

const Store = Reflux.createStore({
	listenables: BuildActions,

	init() {
		// the only purpose of this hash to reconnect all the time
		// except first, see notes at using
		this.connectedResourcesHash = {};
	},

	onReadTerminalOutput(build) {
		const self = this;
		const resourceName = `build${build.id}`;

		// disconnect from all previously connected resources
		_(self.connectedResourcesHash).each((resource) => {
			resource.disconnect();
		});

		const connectToBuildDataResource = function () {
			let resource = self.connectedResourcesHash[resourceName];
			// reconnect for get data below (at subscribe), coz
			// data emitted only once during connect
			if (resource) {
				resource.reconnect();
			} else {
				resource = connect.resource(resourceName);
				self.connectedResourcesHash[resourceName] = resource;
			}

			resource.subscribe('data', (data) => {
				const lastLine = _(self.lines).last();
				if (lastLine && (_(data.lines).first().number === lastLine.number)) {
					self.lines = _(self.lines).initial();
				}
				self.lines = self.lines.concat(data.lines);
				self.trigger({
					buildId: build.id,
					buildCompleted: build.completed,
					name: `Console for build #${build.id}`,
					data: _(self.lines).chain().pluck('text').map((text) => {
						// TODO: this can break output of non-ansible projects
						// prettify ansible output - unescape linebreaks and quotes
						return text.replace(/\\n/g, '\n').replace(/\\"/g, '');
					})
						.value()
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
				(err) => {
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
