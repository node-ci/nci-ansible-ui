import {useState, Fragment} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react';
import _ from 'underscore';

const RunForm = observer(({projects}) => {
	const [projectName, setProjectName] = useState('');
	const [scmBranch, setScmBranch] = useState('');
	const [scmRev, setScmRev] = useState('');
	const [playbookName, setPlaybookName] = useState('');
	const [inventoryNames, setInventoryNames] = useState([]);
	const [limit, setLimit] = useState('');
	const [extraVars, setExtraVars] = useState('');

	let project, playbook, checkedInventoriesCount, isValidForm, buttonClass,
		projectScmRev;

	const history = useHistory();

	const onProjectNameChange = (event) => {
		setProjectName(event.target.value);
		setScmBranch('');
		setScmRev('');
		setPlaybookName('');
		setInventoryNames([]);
		setLimit('');
		setExtraVars('');
	};
	const onScmBranchChange = (event) => setScmBranch(event.target.value);
	const onScmRevChange = (event) => setScmRev(event.target.value);
	const onPlaybookNameChange = (event) => {
		setPlaybookName(event.target.value);
		setInventoryNames([]);
		setLimit('');
		setExtraVars('');
	};
	const onInventoryNamesChange = (event) => {
		const input = event.target;
		const inventoryName = input.value;
		const newInventoryNames = _(inventoryNames).clone();
		if (input.checked) {
			newInventoryNames.push(inventoryName);
		} else {
			const index = newInventoryNames.indexOf(inventoryName);
			if (index !== -1) newInventoryNames.splice(index, 1);
		}
		setInventoryNames(newInventoryNames);
	};
	const onUnselectAllInventoryNames = (event) => {
		event.preventDefault();
		setInventoryNames([]);
	};
	const onSelectAllInventoryNames = (event) => {
		event.preventDefault();
		const project = _(projects).findWhere({name: projectName});
		const playbook = _(project.playbooks).findWhere({name: playbookName});
		setInventoryNames(_(playbook.inventories).pluck('name'));
	};
	const onLimitChange = (event) => setLimit(event.target.value);
	const onExtraVarsChange = (event) => setExtraVars(event.target.value);
	const onCancel = () => history.push('/');
	const onRunProject = () => {
		const buildParams = {};

		if (playbookName) {
			buildParams.playbook = {name: playbookName, inventoryNames};
			if (limit) buildParams.playbook.limit = limit;
			if (extraVars) buildParams.playbook.extraVars = extraVars;
		}

		const project = _(projects).findWhere({name: projectName});
		const buildScmRev = scmBranch === '-1' ? scmRev : scmBranch;
		const projectScmRev = project.scm ? project.scm.rev : '';
		if (buildScmRev && buildScmRev !== projectScmRev) {
			buildParams.scmRev = buildScmRev;
		}

		console.log(
			'>>> Gonna run "%s" with params "%s"',
			project.name,
			JSON.stringify(buildParams)
		);
	};

	return (
		<div className="form-horizontal">
			{(project = undefined, playbook = undefined, null)}
			{projects ?
					<Fragment>
						<div className="form-group">
							<label htmlFor="project-name" className="col-md-offset-2 col-md-2 control-label">Project</label>
							<div className="col-md-4">
								<select id='project-name' onChange={onProjectNameChange} value={projectName} className="form-control">
									<option value="" key="notSet">- select project -</option>
									{_(projects).map(project => {
										return <option value={project.name} key={project.name}>{project.name}</option>;
									})}
								</select>
							</div>
						</div>
						{(project = _(projects).findWhere({name: projectName}), null)}
					</Fragment>
					: null}
			{project ?
				<div className="form-group">
					<label htmlFor="scm-branch" className="col-md-offset-2 col-md-2 control-label">Branch</label>
					<div className="col-md-4">
						{(projectScmRev = project && project.scm ? project.scm.rev : '', null)}
						<select id='scm-branch' onChange={onScmBranchChange} value={scmBranch} className="form-control">
							<option value={projectScmRev}>{projectScmRev}</option>
							<option value={-1}>Custom revision</option>
						</select>
						{scmBranch === '-1' ?
							<Fragment>
								<input value={scmRev} onChange={onScmRevChange} className="form-control" />
							</Fragment>
							: null
						}
					</div>
					</div>
				: null}
			{project && project.playbooks && project.playbooks.length ?
				<Fragment>
					<div className="form-group">
						<label htmlFor="playbook-name" className="col-md-offset-2 col-md-2 control-label">Playbook</label>
						<div className="col-md-4">
							<select id='playbook-name' onChange={onPlaybookNameChange} className="form-control">
								<option value="" key="notSet">- select playbook -</option>
								{project.playbooks.map(playbook => {
									return <option value={playbook.name} key={playbook.name}>{playbook.name}</option>;
								})}
							</select>
						</div>
					</div>
					{(playbook = _(project.playbooks).findWhere({name: playbookName}), null)}
					{playbookName ?
						<Fragment>
							{(checkedInventoriesCount = 0, null)}
							<div className="form-group">
								<label className="col-md-offset-2 col-md-2 control-label">Inventories</label>
								<div className="col-md-4">
									<div className="row">{playbook.inventories.map(inventory => {
										let checked;
										return <div key={'column-for-' + inventory.name} className="col-md-3">
											<label key={'label-for-' + inventory.name}>
												{(checked = _(inventoryNames).contains(inventory.name))}
												{(() => {
													if (checked) checkedInventoriesCount++;
												})()}
												<input type="checkbox" value={inventory.name} key={inventory.name} onChange={onInventoryNamesChange} checked={checked} />{inventory.name}
											</label>
									</div>;})}
									</div>
									<div className="row">
										<div className="col-md-12 text-right">
											{checkedInventoriesCount === playbook.inventories.length ?
													<a href="#;" onClick={onUnselectAllInventoryNames}>Unselect all inventories</a>
												:
													<a href="#;" onClick={onSelectAllInventoryNames}>select all inventories</a>}
										</div>
									</div>
								</div>
							</div>
							<div className="form-group">
								<label htmlFor="limit" title="further limit selected hosts to an additional pattern" className="col-md-offset-2 col-md-2 control-label">Limit</label>
								<div className="col-md-4">
									<input id='limit' type="text" value={limit} onChange={onLimitChange} className="form-control" />
								</div>
							</div>
							<div className="form-group">
								<label htmlFor="extra-vars" title='set additional variables as key=value (e.g. a=123 b="some string") or YAML/JSON (e.g. {a: 123, b: "some string"})' className="col-md-offset-2 col-md-2 control-label">Extra vars</label>
								<div className="col-md-4">
									<input id='extra-vars' type="text" value={extraVars} onChange={onExtraVarsChange} className="form-control" />
								</div>
							</div>
						</Fragment>
					: null}
				</Fragment>
				: null}
			<div className="form-group">
				<div className="col-md-offset-4 col-md-2">
					<button onClick={onCancel} className="btn btn-md btn-default btn-block">
						<i className="fa fa-fw fa-ban" />{" "}
						<span>Cancel</span>
					</button><
				/div>
				<div className="col-md-2">
					{(
						isValidForm = Boolean(
							(project && !project.playbooks) ||
							(project && project.playbooks && playbook &&
							inventoryNames && inventoryNames.length)
						), null
					)}
					{(buttonClass = isValidForm ? '' : 'disabled', null)}
					<button onClick={onRunProject} className={"btn btn-md btn-success btn-block " + buttonClass}>
						<i className="fa fa-fw fa-play" />{" "}
						<span>Run</span>
					</button>
				</div>
			</div>
		</div>
	);
});

export default RunForm;
