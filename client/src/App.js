import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './Home.js';
import RunForm from './components/projects/RunForm.js'

function App() {
	return (
		<div>
			<div className="container-fluid">
				<div className="page-wrapper">
					<Router>
						<Switch>
							<Route path="/projects/run">
								<RunForm />
							</Route>
							<Route path="/">
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
