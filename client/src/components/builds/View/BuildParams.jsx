import {Fragment} from 'react';
import {observer} from 'mobx-react';

const Header = observer(({
	build, project, showConsole, onToggleConsole, onRunAgain, onRunProject
}) => {
	const playbook = build.params.playbook;
	const stepTimings = build.stepTimings ? [...build.stepTimings] : [];
	const {currentStep} = build;
	const lastStepTiming = stepTimings[stepTimings.length - 1];

	return (
		playbook ?
			<Fragment>
				<h3>
					<i className="fa fa-fw fa-sliders" />{" "}Execution parameters
				</h3>
					<div>
						Playbook:{" "}<span>{playbook.name}</span>
					</div>
					<div>
						Inventories:{" "}<span>{playbook.inventoryNames.join(', ')}</span>
					</div>
					{playbook.limit ?
						<div>
							Limit:{" "}<span style={{wordBreak: 'break-all'}}>{playbook.limit}</span>
						</div>
						: null
					}
					{playbook.extraVars ?
						<div>
							Extra vars:{" "}<span style={{wordBreak: 'break-all'}}>{playbook.extraVars}</span>
						</div>
						: null
					}
					<p/>
						<div className="row">
							<div className="col-sm-3">
								<button title="Run again with same parameters" onClick={onRunAgain} className="btn btn-default btn-block"><i className="fa fa-fw fa-repeat" disabled={project.archived} />{" "}Run again</button>
							</div>
							<div className="col-sm-3">
								<button title="Run another project/playbook" onClick={onRunProject} className="btn btn-success btn-block"><i className="fa fa-fw fa-play" />{" "}Run another</button>
								</div>
						</div>
					<h3>
						<i className="fa fa-fw fa-tasks" />{" "}Execution steps
					</h3>
					{!build.completed && currentStep ?
						<Fragment>
							{!lastStepTiming || lastStepTiming.name !== currentStep ?
								(stepTimings.push({name: currentStep}), null)
								: null
							}
						</Fragment>
						: null
					}
					{stepTimings ? stepTimings.map((stepTiming, index) => {
			 			return (
			 				<div key={'step' + index}>
			 					<span>{'* ' + stepTiming.name}</span>
			 					{!build.completed && stepTiming.name === currentStep ?
			 						<Fragment>
			 							<img src="/images/preloader.gif" alt="preloader" width="24" height="24"/>
			 						</Fragment>
			 						: null
			 					}
			 				</div>
			 			);
					})
						: !build.completed ?
							<img src="/images/preloader.gif" alt="preloader" width="32" height="32" />
							: null
					}
					<p/>
					{!showConsole ?
						<div className="row">
							<div className="col-sm-6">
								<button onClick={onToggleConsole} className="btn btn-default btn-block">
									<i className="fa fa-fw fa-terminal" />{" "}Show console output
								</button>
							</div>
						</div>
						: null}
			</Fragment>
			: <Fragment>
				<p/>
				<div className="text-center">
					<button onClick={onRunProject} className="btn btn-success">
						<i className="fa fa-fw fa-play" />{" "}Run another project/playbook
					</button>
				</div>
				{!showConsole ?
						<Fragment>
							<p/>
							<div className="text-center">
								<button onClick={onToggleConsole} className="btn btn-default">
									<i className="fa fa-fw fa-terminal" />{" "}Show console output
								</button>
							</div>
						</Fragment>
						: null
				}
			</Fragment>
		
	);
});

export default Header;
