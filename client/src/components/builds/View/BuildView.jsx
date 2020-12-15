import {Fragment} from 'react';
import {observer} from 'mobx-react';
import _ from 'underscore';
import DateTime from '../../common/DateTime';
import Duration from '../../common/Duration';
import ReviosionItem from '../../common/RevisionItem';

const BuildView = observer(({build}) => {
	const scm = build.scm;
	const rev = scm?.rev;
	const changes = scm?.changes;
	const targetScmRev = build.project.scm.rev;

	let durationTitle;
	if (build.endDate) {
		durationTitle = _(build.stepTimings).map((stepTiming) => {
			return stepTiming.name + ': ' + (stepTiming.duration / 1000).toFixed(1) + ' sec';
		}).join('\n');
	}

	return (
		<div className="build-view_info">
			<div className="row">
				<div className="col-md-12">
					<p>
						<i className="fa fa-fw fa-clock-o" />
						<span>{" "}</span>
						{build.startDate ?
							<Fragment>
								<span>{"Started "}</span>
								<DateTime value={build.startDate} /></Fragment>
							: <Fragment>
								<span>{"Queued "}</span>
								<DateTime value={build.createDate} />
							</Fragment>}
						{build.endDate ?
							<Fragment>
								, finished{" "}
									<DateTime value={build.endDate} />, took{" "}
									<Duration value={build.endDate - build.startDate} title={durationTitle} />
							</Fragment>
							: null}
					</p>
				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<p>
						<i className="fa fa-fw fa-code-fork" />
						Scm target is{"\n"}{" "}
						<span>{targetScmRev}</span>,{"\n"}{" "}
						{changes ?
							changes.length ?
								"changes:" :
								<Fragment>no changes, current revision is
							 
								"<ReviosionItem revision={rev} />" by{" "}
								{rev.author}</Fragment>
							: build.status === 'in-progress' ?
								"pulling scm changes..." :
								"changes are not received"
						}
					</p>
				</div>
			</div>
			{changes && changes.length ?
				<span revisions={changes} />
				: null
			}
		</div>
	);
});

export default BuildView;
