import _ from 'underscore';
import {makeAutoObservable} from 'mobx';

export default class BuildModel {
	item = null

	constructor({data}) {
		makeAutoObservable(this);
		this.data = data;
		this.buildsResource = this.data.resource('builds');
		this.buildsResource.subscribe(
			'change',
			(data) => this._onItemChange(data)
		);
		this.terminalResourcesMap = {};
	}

	_onItemChange(data) {
		if (this.item && (data.buildId === this.item.id)) {
			_(this.item).extend(data.changes);
		}
	}

	_setItem(item) {
		this.item = item;
	}

	fetch(params) {
		this.item = null;
		this.buildsResource.sync('read', params, (err, build) => {
			if (err) throw err;
			this._setItem(build);
		});
	}

	getTerminalData(callback) {
		if (!this.item) {
			throw new Error('There is no item to get terminal data');
		}

		const terminalResourceName = `build${this.item.id}`;

		// disconnect from all previously connected resources
		_(this.terminalResourcesMap).each((resource) => resource.disconnect());

		const connectToBuildDataResource = () => {
			let resource = this.terminalResourcesMap[terminalResourceName];
			// reconnect to get data, data emits only once during connection
			if (resource) {
				resource.reconnect();
			} else {
				resource = this.data.resource(terminalResourceName);
				this.terminalResourcesMap[terminalResourceName] = resource;
			}

			resource.subscribe('data', (data) => {
				const lastLine = _(this.lines).last();
				if (lastLine && (_(data.lines).first().number === lastLine.number)) {
					this.lines = _(this.lines).initial();
				}
				this.lines = this.lines.concat(data.lines);
				callback({
					buildId: this.item.id,
					buildCompleted: this.item.completed,
					name: `Console for build #${this.item.id}`,
					data: _(this.lines).chain().pluck('text').map((text) => {
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
		if (this.item.completed) {
			this.data.resource('projects').sync(
				'createBuildDataResource',
				{buildId: this.item.id},
				(err) => {
					if (err) throw err;
					connectToBuildDataResource();
				}
			);
		} else {
			connectToBuildDataResource();
		}
	}
}
