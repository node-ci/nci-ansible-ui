const {Steppy} = require('twostep');
const _ = require('underscore');
const helpers = require('./helpers');

const stringifyArgValue = function (value) {
	return `"${value.replace(/"/g, '\\"')}"`;
};

const makeProject = function (project, buildParams) {
	const newProject = _(project).clone();

	const playbookName = buildParams.playbook && buildParams.playbook.name;
	if (playbookName) {
		if (!project.playbooks) {
			throw new Error(
				`No playbooks in the project ${project.name} but ` +
				'playbookName is specified'
			);
		}

		const playbook = _(project.playbooks).findWhere({name: playbookName});

		if (!playbook) {
			throw new Error(
				`No playbook ${playbookName} in ${
					project.name} project`
			);
		}

		const {inventoryNames} = buildParams.playbook;
		const {limit} = buildParams.playbook;
		const {extraVars} = buildParams.playbook;

		if (!inventoryNames || !inventoryNames.length) {
			throw new Error(
				`Inventory not specified for playbook ${playbook.name
				} (project ${project.name})`
			);
		}

		const inventories = _(inventoryNames).map((inventoryName) => {
			const inventory = _(playbook.inventories).findWhere({
				name: inventoryName
			});

			if (!inventory) {
				throw new Error(
					`No Inventory ${inventoryName} in ${playbook.name
					} (project ${project.name})`
				);
			}

			return inventory;
		});

		const playbookSteps = _(inventories).map((inventory) => {
			const args = [
				project.playbookCommand,
				playbook.path,
				`--inventory-file=${inventory.path}`
			];

			if (limit) {
				args.push(`--limit=${limit}`);
			}

			if (extraVars) {
				args.push(`--extra-vars=${stringifyArgValue(extraVars)}`);
			}

			const stepName = (
				`run playbook ${playbook.name} with ${inventory.name
				} inventory`
			);

			const yellow = '\\033[0;33m';
			const noColor = '\\033[0m';

			const echoCommand = (
				`${'echo "******************";' +
				'echo -e "********* '}${yellow}${stepName.toUpperCase()
				}${noColor} *********";` +
				'echo "******************";'
			);

			return {
				type: 'shell',
				name: stepName,
				cmd: echoCommand + args.join(' ')
			};
		});

		newProject.steps = newProject.steps.concat(playbookSteps);
	}

	return newProject;
};

const patchDirstributor = function (distributor) {
	const originalMakeProjet = distributor._makeProject;
	distributor._makeProject = function (project, buildParams) {
		let newProject = originalMakeProjet(project, buildParams);
		newProject = makeProject(newProject, buildParams);
		return newProject;
	};
};

const extendProject = function (project) {
	if (project.playbooks) {
		_(project).defaults({
			playbookCommand: 'ANSIBLE_FORCE_COLOR=true ansible-playbook'
		});
	}

	return project;
};

module.exports = function (app) {
	const logger = app.lib.logger('projects resource');
	const resource = app.dataio.resource('projects');

	patchDirstributor(app.builds.distributor);

	app.projects.on('projectLoaded', (project) => {
		extendProject(project);
	});

	resource.use('createBuildDataResource', (req, res) => {
		helpers.createBuildDataResource(app, req.data.buildId);
		res.send();
	});

	resource.use('readAll', (req, res) => {
		let filteredProjects = app.projects.getAll();
		const nameQuery = req.data && req.data.nameQuery;

		filteredProjects = app.projects.filter((project) => {
			return !project.archived;
		});

		if (nameQuery) {
			filteredProjects = _(filteredProjects).filter((project) => {
				return project.name.indexOf(nameQuery) !== -1;
			});
		}

		filteredProjects = _(filteredProjects).sortBy('name');

		res.send(filteredProjects);
	});

	// get project with additional fields
	const getProject = function (name, callback) {
		let project;
		Steppy(
			function () {
				project = _(app.projects.get(name)).clone();

				app.builds.getRecent({
					projectName: project.name,
					status: 'done',
					limit: 10
				}, this.slot());

				app.builds.getDoneStreak({projectName: project.name}, this.slot());
			},
			function (err, doneBuilds, doneBuildsStreak) {
				project.avgBuildDuration = app.builds.getAvgBuildDuration(doneBuilds);
				[project.lastDoneBuild] = doneBuilds;
				project.doneBuildsStreak = doneBuildsStreak;

				this.pass(project);
			},
			callback
		);
	};

	// resource custom method which finds project by name
	// and emits event about it change to clients
	resource.clientEmitSyncChange = function (name) {
		Steppy(
			function () {
				getProject(name, this.slot());
			},
			(err, project) => {
				resource.clientEmitSync('change', {project});
			},
			(err) => {
				// eslint-disable-next-line no-console
				console.error(
					'Error during sync project change occurred:',
					err.stack || err
				);
			}
		);
	};

	resource.use('read', (req, res) => {
		Steppy(
			function () {
				getProject(req.data.name, this.slot());
			},
			(err, project) => {
				res.send(project);
			}
		);
	});

	resource.use('run', (req, res) => {
		const {projectName} = req.data;
		const {buildParams} = req.data;

		logger.log(
			'Run the project: "%s" with params: %j',
			projectName,
			buildParams
		);

		app.builds.create({
			projectName,
			initiator: {type: 'user'},
			queueQueued: true,
			buildParams
		});

		res.send();
	});

	return resource;
};
