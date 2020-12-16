import {Fragment} from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import DateTime from '../../common/DateTime';
import Duration from '../../common/Duration';

const Sidebar = observer(({items, currentBuildId, onCancelBuild}) => {
	const makeOnCancelBuild = (buildId) => {
		return (event) => {
			onCancelBuild(event, {buildId});
		};
	};

	return (
		<div className="builds builds__timeline builds__timeline-small">{
			items.map(item => {
				let buildItemClasses;

				return [
					(buildItemClasses = ['builds_item__' + item.status], null), (() => {
			  			if (item.id === currentBuildId) buildItemClasses.push('builds_item__current');
					})(),
					<div key={item.id} className={"builds_item " + buildItemClasses.join(' ')}>
						<div className="builds_inner">
							<div className="row">
								<div className="builds_header">
									{item.project ?
										<div>
											<span>{item.project.name}</span>
										</div>
										: null
									}
									{item.status === 'queued' ?
										<span title={'wait reason: ' + item.waitReason}>queued</span> :
										<Link to={`/builds/${item.id}`} >
											<span>execution #</span>
											<span>{item.number}</span>
										</Link>
									}
								</div>
								<div className="builds_controls">
									{item.status === 'in-progress' ?
										<div className="builds_progress">
											{item.project && item.project.avgBuildDuration ?
												<span build={item} />
												: null}
										</div> : null
									}
									{item.endDate ?
										<Fragment>
											<div>
												<DateTime value={item.endDate} />
											</div>
											<div>
												took{"\n"}{" "}
												<Duration value={item.endDate - item.startDate} />
											</div>
										</Fragment>
										: null
									}
									{item.status === 'queued' || item.status === 'in-progress' ?
										<div className="builds_buttons">
											<a href="#;" onClick={makeOnCancelBuild(item.id)} className="btn btn-sm btn-default">
												<i title="Cancel execution" className="fa fa-fw fa-times" />
												{" "}{"\n"}Cancel
											</a>
										</div>
										: null
									}
								</div>
							</div>
						</div>
					</div>
				];
			})
		}</div>
	);
});

export default Sidebar;
