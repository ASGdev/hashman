import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Alert from 'react-bootstrap/Alert'
import LocationsHandler from './LocationsHandler'
import FilesHandler from './FilesHandler'
import AdminHandler from './AdminHandler'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Keycloak from 'keycloak-js';

function App() {
	const [key, setKey] = useState('files')
	const [keycloak, setKeycloak] = useState(null)
	const [authenticated, setAuthenticated] = useState(false)
	
	useEffect(() => {
		const keycloak = Keycloak('/keycloak.json');
		keycloak.init({onLoad: 'login-required'}).then(authenticated => {
			setKeycloak(keycloak)
			setAuthenticated(authenticated)
		})
	}, [])
	
	if(authenticated){
		return (
				<Router>
					<div>
						<Tabs activeKey={key} onSelect={(k) => setKey(k)}>
							<Tab eventKey="files" title="Files" >
								<FilesHandler />
							</Tab>
							<Tab eventKey="locations" title="Locations">
								<LocationsHandler />
							</Tab>
							<Tab eventKey="admin" title="Admin">
								<AdminHandler />
							</Tab>
						</Tabs>

					  
					</div>
				</Router>
		)
	}
	else {
		return (
			<Alert variant="info" className="m-2">
				Waiting for authentication...
			</Alert>)
	}

}

export default App;
