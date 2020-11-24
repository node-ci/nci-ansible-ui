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

	run(projectName, buildParams) {
		projectsResource.sync('run', {projectName, buildParams}, (err) => {
			if (err) throw err;
		});
	}
}

const buildsResource = data.resource('builds');

class BuildsModel {
	items = null

	constructor() {
		makeAutoObservable(this);
	}

	_setItems(items) {
		this.items = items;
	}

	fetchItems(params) {
		buildsResource.sync('readAll', params, (err, builds) => {
			if (err) throw err;
			this._setItems(builds);
		});
	}
}

export const projects = new ProjectsModel();
export const builds = new BuildsModel();
