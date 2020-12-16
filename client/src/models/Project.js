import {makeAutoObservable} from 'mobx';

export default class ProjectModel {
	item = null

	constructor({data}) {
		makeAutoObservable(this);
		this.data = data;
		this.projectsResource = this.data.resource('projects');
	}

	_setItem(item) {
		this.item = item;
	}

	fetch(params) {
		this.item = null;
		this.projectsResource.sync('read', params, (err, project) => {
			if (err) throw err;
			this._setItem(project);
		});
	}
}

