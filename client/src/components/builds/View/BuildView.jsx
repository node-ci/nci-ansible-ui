import {Fragment} from 'react';
import {observer} from 'mobx-react';
import _ from 'underscore';
import {ansi_to_html} from 'ansi_up';
import DateTime from '../../common/DateTime';
import Duration from '../../common/Duration';
import ReviosionItem from '../../common/RevisionItem';
import RevisionList from '../../common/RevisionList';

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
		<Fragment>
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
							Scm target is{" "}
							<span>{targetScmRev}</span>,{" "}
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
				{changes && changes.length ? <RevisionList revisions={changes} /> : null
				}
			</div>
			<div>
				{build.error ?
					<Fragment>
						{build.error.message ?
							<Fragment>
								<h3>
									Build{" "}{build.currentStep ?
										<Fragment>
											step <span>"{build.currentStep}"</span>
										</Fragment>
										: null
									}{' '}
									failed with error:
								</h3>
								<div className="alert">
									{build.error.message}
								</div>
							</Fragment>
							: null
						}
						{build.error.stderr ?
							<Fragment>
								<h3>stderr:</h3>
								<div style={{whiteSpace: 'pre-wrap'}} className="alert" dangerouslySetInnerHTML={{__html: ansi_to_html(build.error.stderr)}} />
							</Fragment>
							: null}
					</Fragment>
					: build.status === 'canceled' ?
						<h3>
							Execution canceled{" "}
							{build.currentStep ?
								<Fragment>
									during step{' '}
									<span>"{build.currentStep}"</span>
								</Fragment>
								: null}
						</h3>
						: null
				}
			</div>
		</Fragment>
	);
});

export default BuildView;
