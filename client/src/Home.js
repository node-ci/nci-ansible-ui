import {useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {observer} from 'mobx-react';

const Home = observer(({buildsModel}) => {
	useEffect(() => {
		console.log('>>> fetch builds')
		buildsModel.fetchItems({limit: 1});
	}, [buildsModel]);

	if (buildsModel.items) {
		const build = buildsModel.items[0];
		const url = build ? `/builds/${build.id}` : '/projects/run';
		return <Redirect to={url} />;
	} else {
		return null;
	}

});

export default Home;
