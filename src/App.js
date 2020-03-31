import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import engine from '~engine';

import './global.css';

import Interface from '~Interface';
import PrototypesIndex from '~Prototypes';
import GridScrollPrototype from '~Prototypes/GridScroll';

const App = () => (
	<Router>
		<Switch>
			<Route exact path="/prototypes">
				<PrototypesIndex />
			</Route>
			<Route path="/prototypes/grid-scroll">
				<GridScrollPrototype />
			</Route>
			<Interface engine={engine} />
		</Switch>
	</Router>
);

export default App;
