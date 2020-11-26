import {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {observer} from 'mobx-react';

const Home = observer(({buildsModel}) => {
	const [loadingBuilds, setLoadingBuilds] = useState(false);

	useEffect(() => {
		if (!loadingBuilds) {
			console.log('>>> fetch builds...')
			setLoadingBuilds(true);
			buildsModel.fetchItems({limit: 1});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loadingBuilds && buildsModel.items) {
		const build = buildsModel.items[0];
		const url = build ? `/builds/${build.id}` : '/projects/run';
		return <Redirect to={url} />;
	} else {
		return null;
	}

});

export default Home;
