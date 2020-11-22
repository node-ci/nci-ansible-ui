import {useHistory} from 'react-router-dom';

function Home() {
	const history = useHistory();
	history.push('/projects/run');
	return null;
}

export default Home;
