import _ from 'underscore';
import {makeAutoObservable} from 'mobx';

export default class BuildsModel {
	items = null

	constructor({data}) {
		makeAutoObservable(this);
		this.data = data;
		this.buildsResource = this.data.resource('builds');
		this.buildsResource.subscribe(
			'change',
			(data) => this._onItemChange(data)
		);
		this.buildsResource.subscribe(
			'cancel',
			(data) => this._onItemCancelled(data)
		);
	}

	_onItemChange(data) {
		const oldBuild = _(this.items).findWhere({id: data.buildId});
		if (oldBuild) {
			_(oldBuild).extend(data.changes);
		} else {
			this.items.unshift(
				_({id: data.buildId}).extend(data.changes)
			);
		}
	}

	_onItemCancelled(data) {
		// WORKAROUND: client that trigger `onCancel` gets one `onCancelled`
		// call other clients get 2 calls (second with empty data)
		if (!data) {
			return;
		}

		if (data.buildStatus === 'queued') {
			const index = _(this.items).findIndex({id: data.buildId});
			if (index !== -1) {
				this.items.splice(index, 1);
			}
		}
	}

	_setItems(items) {
		this.items = items;
	}

	fetchItems(params) {
		this.items = null;
		this.buildsResource.sync('readAll', params, (err, builds) => {
			if (err) throw err;
			this._setItems(builds);
		});
	}

	cancelBuild(buildId) {
		this.buildsResource.sync('cancel', {buildId}, (err) => {
			if (err) throw err;
		});
	}

}


