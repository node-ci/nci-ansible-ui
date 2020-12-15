import {useEffect, Fragment} from 'react';
import {observer} from 'mobx-react';
import {useParams, useHistory} from 'react-router-dom';
import Header from './Header.jsx';
import BuildView from './BuildView.jsx';
import BuildParamsView from './BuildParamsView';
import './index.css';

const BuildsView = observer(({buildModel, projectModel, projectsModel}) => {
	const {buildId} = useParams();

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

	return (
		<div className="row">
			<div className="col-sm-3 hidden-xs" />
			<div className="col-sm-9">
				<Header build={build} project={project} />
				<BuildView build={build} />
				<BuildParamsView build={build} project={project} projectsModel={projectsModel} />
			</div>
		</div>
	);
});

export default BuildsView;
