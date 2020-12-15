import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './Home.jsx';
import RunForm from './components/projects/RunForm.jsx'
import BuildsView from './components/builds/View/index.jsx'
import {socket} from './connect';
import {projects, project, builds, build} from './models';

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
							<Route exact path="/builds/:buildId">
								<BuildsView buildModel={build} projectModel={project} projectsModel={projects} />
							</Route>
							<Route exact path="/">
								<Home buildsModel={builds} />
							</Route>
						</Switch>
					</Router>
				</div>
			</div>
		</div>
	);
}

export default App;
