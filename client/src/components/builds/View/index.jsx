import {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useParams} from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import BuildView from './BuildView.jsx';
import BuildParamsView from './BuildParamsView';
import './index.css';

const BuildsView = observer(({
	buildsModel, buildModel, projectModel, projectsModel
}) => {
	const params = useParams();
	const buildId = Number(params.buildId);

	useEffect(() => {
		console.log('>>> fetch build ', buildId)
		buildModel.fetch({id: buildId});
		buildsModel.fetchItems();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buildId]);

	const onCancelBuild = (event, {buildId}) => {
		buildsModel.cancelBuild(buildId);
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
				<BuildView build={build} />
				<BuildParamsView build={build} project={project} projectsModel={projectsModel} />
			</div>
		</div>
	);
});

export default BuildsView;
