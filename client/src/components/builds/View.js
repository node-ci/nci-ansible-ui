import {useEffect, Fragment} from 'react';
import {observer} from 'mobx-react';
import {useParams, Link} from 'react-router-dom';
import './View.css';

const BuildsView = observer(({buildModel, projectModel}) => {
	const {buildId} = useParams();

	useEffect(() => {
		console.log('>>> fetch build ', buildId)
		buildModel.fetch({id: buildId});
	}, [buildModel, buildId]);

	const build = buildModel.item;
	if (!build) return null;

	if (build && !projectModel.item) {
		projectModel.fetch({name: build.project.name});
	}

	const project = projectModel.item;
	if (!project) return null;


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
								<span title="canceled by #{canceledBy.type}" className="label label-warning">canceled</span>
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
			</div>
		</div>
	);
});

export default BuildsView;
