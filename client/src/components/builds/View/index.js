import {useEffect, Fragment} from 'react';
import {observer} from 'mobx-react';
import {useParams, useHistory, Link} from 'react-router-dom';
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

	let _canceledBy, _node, _env, _initiator;

	return (
		<div className="row">
			<div className="col-sm-3 hidden-xs" />
			<div className="col-sm-9">
				<h1 className="page-header">
					<div style={{fontSize: '22px'}} className="pull-right">
						{build.status === 'in-progress' ?
							<span className="label label-info">in progress</span>
							: null}
						{build.status === 'queued' ?
							<span className="label label-default">queued</span>
							: null}
						{build.status === 'done' ?
							<span className="label label sm label-success">done</span>
							: null}
						{build.status === 'error' ?
							<span className="label label-danger">error</span>
							: null}
						{build.status === 'canceled' ?
							<Fragment>
								{(_canceledBy = build.canceledBy, null)}
								<span title={`"canceled by #${_canceledBy.type}`} className="label label-warning">canceled</span>
							</Fragment>
							: null}
					</div>
					{project.archived ?
						<i title="Project is archived" className="fa fa-fw fa-archive" />
						: <div scm={build.project.scm.type} />}
					<span>{build.project.name}</span>
					{" "}
					<span>execution #</span>
					<span>{build.number}</span>

					<Fragment>
						<p />
						<div className="small text-muted">
							{(_node = build.node, null)}
							{_node ?
								<Fragment>
									On{" "}<span>{_node.type}</span> node
									{_node.type !== _node.name ? <Fragment> "<span>{_node.name}</span>"</Fragment> : null}
									{(_env = build.env, null)}
								{_env ? <Fragment>, within "<span>{_env.name}</span>" environment</Fragment> : null}
								, initiated by
								{" "}
								</Fragment>
								: <Fragment>Initiated by</Fragment>}
							{(_initiator = build.initiator, null)}
							{_initiator ?
								_initiator.type === 'build' && _initiator.project ?
									<Fragment>
										<span>{_initiator.project.name}</span>
										during the 
										 <Link to={`/builds/{_initiator.id}`}>
											<span>execution #</span>
											<span>{_initiator.number}</span>
										</Link>
									</Fragment>
									: <span>{_initiator.type}</span>
								: null}
						</div>
					</Fragment>
				</h1>

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
