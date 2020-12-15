import {useEffect, Fragment} from 'react';
import {observer} from 'mobx-react';
import {useParams, useHistory} from 'react-router-dom';
import Header from './Header.jsx';
import BuildView from './BuildView.jsx';
import './index.css';

const BuildsView = observer(({buildModel, projectModel, projectsModel}) => {
	const {buildId} = useParams();
	const history = useHistory();

	useEffect(() => {
		console.log('>>> fetch build ', buildId)
		buildModel.fetch({id: buildId});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const build = buildModel.item;
	if (!build) return null;

	if (build && !projectModel.item) {
		projectModel.fetch({name: build.project.name});
	}

	const project = projectModel.item;
	if (!project) return null;

	const onRunAgain = () => {
		if (build && build.project) {
			projectsModel.run(build.project.name, build.params);
		}
		// TODO: go to last build in a durable way
		setTimeout(() => {
			history.push('/');
		}, 500);
	};
	const onRunProject = () => {
		history.push('/projects/run');
	};

	return (
		<div className="row">
			<div className="col-sm-3 hidden-xs" />
			<div className="col-sm-9">
				<Header build={build} project={project} />
				<BuildView build={build} />
				<Fragment>
					<p/>
					<div className="row">
						<div className="col-sm-3">
							<button title="Run again with same parameters" onClick={onRunAgain} className="btn btn-default btn-block"><i className="fa fa-fw fa-repeat" disabled={project.archived} />{" "}{"\n"}Run again</button>
						</div>
						<div className="col-sm-3">
							<button title="Run another project/playbook" onClick={onRunProject} className="btn btn-success btn-block"><i className="fa fa-fw fa-play" />{" "}{"\n"}Run another</button>
							</div>
					</div>
				</Fragment>
			</div>
		</div>
	);
});

export default BuildsView;
