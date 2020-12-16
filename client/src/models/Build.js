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
}



