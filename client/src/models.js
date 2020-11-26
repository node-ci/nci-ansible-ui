import {data} from './connect';
import {makeAutoObservable} from 'mobx';

const projectsResource = data.resource('projects');

class ProjectsModel {
	items = null

	constructor() {
		makeAutoObservable(this);
	}

	_setItems(items) {
		this.items = items;
	}

	fetchItems(params) {
		this.items = null;
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

class ProjectModel {
	item = null

	constructor() {
		makeAutoObservable(this);
	}

	_setItem(item) {
		this.item = item;
	}

	fetch(params) {
		this.item = null;
		projectsResource.sync('read', params, (err, project) => {
			if (err) throw err;
			this._setItem(project);
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
		this.items = null;
		buildsResource.sync('readAll', params, (err, builds) => {
			if (err) throw err;
			this._setItems(builds);
		});
	}
}

class BuildModel {
	item = null

	constructor() {
		makeAutoObservable(this);
	}

	_setItem(item) {
		this.item = item;
	}

	fetch(params) {
		this.item = null;
		buildsResource.sync('read', params, (err, build) => {
			if (err) throw err;
			this._setItem(build);
		});
	}
}

export const projects = new ProjectsModel();
export const project = new ProjectModel();
export const builds = new BuildsModel();
export const build = new BuildModel();
