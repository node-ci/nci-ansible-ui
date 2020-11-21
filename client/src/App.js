import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function Home() {
	return <span>Home sweet home</span>;
}

function App() {
	return (
		<div>
			<div className="container-fluid">
				<div className="page-wrapper">
					<Router>
						<Switch>
							<Route path="/projects/run">
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
