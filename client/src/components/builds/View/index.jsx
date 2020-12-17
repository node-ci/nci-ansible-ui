import {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useParams, useHistory} from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import BuildInfo from './BuildInfo.jsx';
import BuildParams from './BuildParams';
import Terminal from './Terminal';
import './index.css';

const BuildsView = observer(({
	buildsModel, buildModel, projectModel, projectsModel
}) => {
	const params = useParams();
	const buildId = Number(params.buildId);

	const history = useHistory();
	const [showConsole, setShowConsole] = useState(false);

	useEffect(() => {
		console.log('>>> fetch build ', buildId)
		setShowConsole(false);
		buildModel.fetch({id: buildId});
		buildsModel.fetchItems();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buildId]);

	const onCancelBuild = (event, {buildId}) => {
		buildsModel.cancelBuild(buildId);
	};


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
	const onToggleConsole = () => {
		setShowConsole(!showConsole);
	};

	const build = buildModel.item;
	if (!build) return null;

	const builds = buildsModel.items;
	if (!builds) return null;

	if (build && !projectModel.item) {
		projectModel.fetch({name: build.project.name});
	}

	const project = projectModel.item;
	if (!project) return null;

	return (
		<div className="row">
			<div className="col-sm-3 hidden-xs">
				<Sidebar items={builds} currentBuildId={buildId} onCancelBuild={onCancelBuild} />
			</div>
			<div className="col-sm-9">
				<Header build={build} project={project} />
				<BuildInfo build={build} />
				<BuildParams build={build} project={project} showConsole={showConsole} onToggleConsole={onToggleConsole} onRunAgain={onRunAgain} onRunProject={onRunProject} />
				<Terminal buildModel={buildModel} showConsole={showConsole} onToggleConsole={onToggleConsole} />
			</div>
		</div>
	);
});

export default BuildsView;
