import {makeObservable, observable, action} from 'mobx';

export default class ProjectModel {
	item = null
	fetching = false

	constructor({data}) {
		makeObservable(this, {
			item: observable,
			_setItem: action
		});
		this.data = data;
		this.projectsResource = this.data.resource('projects');
	}

	_setItem(item) {
		this.item = item;
	}

	fetch(params) {
		if (this.fetching) return null;
		this.fetching = true;
		this._setItem(null);
		this.projectsResource.sync('read', params, (err, project) => {
			this.fetching = false;
			if (err) throw err;
			this._setItem(project);
		});
	}
}

