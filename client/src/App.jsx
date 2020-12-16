import {BrowserRouter, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './Home.jsx';
import RunForm from './components/projects/RunForm.jsx'
import BuildsView from './components/builds/View/index.jsx'
import connect from './connect';
import {
	BuildsModel, BuildModel, ProjectsModel, ProjectModel
} from './models/index.js';

const {socket, data} = connect();

socket.on('connect', () => {
  console.log('socket.io is connected!');
});

const buildsModel = new BuildsModel({data});
const buildModel = new BuildModel({data});
const projectsModel = new ProjectsModel({data});
const projectModel = new ProjectModel({data});

function App() {
	return (
		<div>
			<div className="container-fluid">
				<div className="page-wrapper">
					<BrowserRouter>
						<Switch>
							<Route exact path="/projects/run">
								<RunForm projectsModel={projectsModel} />
							</Route>
							<Route exact path="/builds/:buildId">
								<BuildsView buildsModel={buildsModel} buildModel={buildModel} projectModel={projectModel} projectsModel={projectsModel} />
							</Route>
							<Route exact path="/">
								<Home buildsModel={buildsModel} />
							</Route>
						</Switch>
					</BrowserRouter>
				</div>
			</div>
		</div>
	);
}

export default App;
