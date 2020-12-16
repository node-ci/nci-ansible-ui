import {makeAutoObservable} from 'mobx';

export default class BuildsModel {
	items = null

	constructor({data}) {
		makeAutoObservable(this);
		this.data = data;
		this.buildsResource = this.data.resource('builds');
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
}


