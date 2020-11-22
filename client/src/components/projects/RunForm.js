import {Fragment} from 'react';
import _ from 'underscore';

function RunForm({
	projects, projectName, scmRev, scmBranch, playbookName, inventoryNames,
	limit, extraVars
}) {

  let project, playbook, checkedInventoriesCount, isValidForm, _buttonClasses;

  const onProjectNameChange = _.noop;
  const onScmBranchChange = _.noop;
  const onScmRevChange = _.noop;
  const onPlaybookNameChange = _.noop;
  const onInventoryNamesChange = _.noop;
  const onUnselectAllInventoryNames = (event) => event.preventDefault();
  const onSelectAllInventoryNames = (event) => event.preventDefault();
  const onLimitChange = _.noop;
  const onExtraVarsChange = _.noop;
  const onCancel = _.noop;
  const onRunProject = _.noop;

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
						{(scmRev = project && project.scm ? project.scm.rev : '', null)}
						<select id='scm-branch' onChange={onScmBranchChange} className="form-control">
							<option value={scmRev}>{scmRev}</option>
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
												{(checked = _(inventoryNames).contains(inventory.name), null)}
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
						isValidForm = (
							(project && !project.playbooks) ||
							(project && project.playbooks && playbook &&
							inventoryNames && inventoryNames.length)
						), null
					)}
					{(_buttonClasses = isValidForm ? ['disabled'] : [], null)}
					<button onClick={onRunProject} className={"btn btn-md btn-success btn-block " + _buttonClasses}>
						<i className="fa fa-fw fa-play" />{" "}
						<span>Run</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default RunForm;
