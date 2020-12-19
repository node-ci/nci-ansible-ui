import {makeObservable, observable, action} from 'mobx';

export default class ProjectsModel {
	items = null

	constructor({data}) {
		makeObservable(this, {
			items: observable,
			_setItems: action
		});
		this.data = data;
		this.projectsResource = this.data.resource('projects');
	}

	_setItems(items) {
		this.items = items;
	}

	fetchItems(params) {
		this._setItems(null);
		this.projectsResource.sync('readAll', params, (err, projects) => {
			if (err) throw err;
			this._setItems(projects);
		});
	}

	run(projectName, buildParams) {
		this.projectsResource.sync('run', {projectName, buildParams}, (err) => {
			if (err) throw err;
		});
	}
}
