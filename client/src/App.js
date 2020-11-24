import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './Home.js';
import RunForm from './components/projects/RunForm.js'
import {socket} from './connect';
import {projects} from './models';

socket.on('connect', () => {
  console.log('socket.io is connected!');
});

function App() {
	return (
		<div>
			<div className="container-fluid">
				<div className="page-wrapper">
					<Router>
						<Switch>
							<Route exact path="/projects/run">
								<RunForm projectsModel={projects} />
							</Route>
							<Route exact path="/">
								<Home />
							</Route>
						</Switch>
					</Router>
				</div>
			</div>
		</div>
	);
}

export default App;
