import {useState, Fragment} from 'react';
import {observer} from 'mobx-react';
import RevisionItem from './RevisionItem';

const RevisionList = observer(({revisions}) => {
	const [limit, setLimit] = useState(20); 
	const limitedRevisions = revisions.slice(0, limit);

	const onShowMoreRevisions = (event) => {
		event.preventDefault();
		setLimit(limit + 20);
	};

	return (
		<Fragment>
			{limitedRevisions.map((revision, index) => {
				const number = index + 1;

				return [
					<div key={'scm-revision-' + number} className="row">
						<div className="col-md-offset-4 col-md-8">
							<p>
								<span>{String(number) + '. '}</span>
								{" "}
								<RevisionItem revision={revision} />
							</p>
						</div>
					</div>
				];
			})}
			{limitedRevisions.length < revisions.length ?
				<div className="row">
					<div className="col-md-offset-4 col-md-8">
						<a href="#;" onClick={onShowMoreRevisions}>
							<i title="Show more builds" className="fa fa-fw fa-refresh" />show more revisions{" "}
								<span>({limitedRevisions.length}</span>{" "}
								from{" "}<span>{revisions.length}</span>{" "}
								are shown)
						</a>
					</div>
				</div>
				: null
			}
		</Fragment>
	);
});

export default RevisionList;
