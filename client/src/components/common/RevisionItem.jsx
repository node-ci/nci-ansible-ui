import {observer} from 'mobx-react';

const RevisionItem = observer(({revision}) => {
	const title = `Revision: ${revision.id} by ${revision.author}`;

	return (
		<span title={title}>{revision.comment}</span>
	);
});

export default RevisionItem;
