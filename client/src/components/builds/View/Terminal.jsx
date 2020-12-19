import {Fragment} from 'react';
import {observer} from 'mobx-react';
import BuildTerminal from '../../common/BuildTerminal';
import Duration from '../../common/Duration';

const Terminal = observer(({buildModel, showConsole, onToggleConsole}) => {
	const build = buildModel.item;
	if (!build) return null;

	return (
		<div className="build-view_terminal">
			{showConsole ?
				<Fragment>
					<h3>
						<i className="fa fa-fw fa-terminal" />{" "}{"\n"}Console output
					</h3>
					<BuildTerminal buildModel={buildModel} showPreloader={true} />
					{build.completed ?
						build.status === 'error' ?
							<div className="text-center alert alert-danger">
								Execution ended with error, took{"\n"}{" "}
								<Duration value={build.endDate - build.startDate} />
							</div>
						: build.status === 'canceled' ?
							<div className="text-center alert alert-warning">
								Execution canceled, took{"\n"}{" "}
								<Duration value={build.endDate - build.startDate} />
							</div>
						: build.status === 'done' ?
							<div className="text-center alert alert-success">
								Execution successfully completed, took{"\n"}{" "}
								<Duration value={build.endDate - build.startDate} />
							</div>
						: null
					: null}
					<div className="text-center">
						<button onClick={onToggleConsole} className="btn btn-default">
							<i className="fa fa-fw fa-terminal" />{" "}{"\n"}
							Hide console output
						</button>
					</div>
				</Fragment>
			: null}
		</div>
	);
});

export default Terminal;
