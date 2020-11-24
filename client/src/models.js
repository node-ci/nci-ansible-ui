import {data} from './connect';
import {makeAutoObservable} from 'mobx';

const projectsResource = data.resource('projects');

class ProjectsModel {
	items = []

	constructor() {
		makeAutoObservable(this);
	}

	_setItems(items) {
		this.items = items;
	}

	fetchItems(params) {
		projectsResource.sync('readAll', params, (err, projects) => {
			if (err) throw err;
			this._setItems(projects);
		});
	}
}

export const projects = new ProjectsModel();
