import {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useParams} from 'react-router-dom';

const BuildsView = observer(({buildModel}) => {
	const {buildId} = useParams();

	useEffect(() => {
		console.log('>>> fetch build ', buildId)
		buildModel.fetch({id: buildId});
	}, [buildModel, buildId]);

	if (!buildModel.item) return null;

	const build = buildModel.item;

	return (
		<div>
			<div>This is a page for build {build.id}</div>
			<pre>{JSON.stringify(build, null, 4)}</pre>
		</div>
	);
});

export default BuildsView;
