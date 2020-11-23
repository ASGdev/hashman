import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import LocationsHandler from './LocationsHandler'
import FilesHandler from './FilesHandler'
import AdminHandler from './AdminHandler'
import DirectoriesHandler from './DirectoriesHandler'
import CompareHandler from './CompareHandler'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function Hashman() {
	const [key, setKey] = useState('files');
	
  return (

		<div>
			<Tabs activeKey={key} onSelect={(k) => setKey(k)}>
				<Tab eventKey="files" title="Files" >
					<FilesHandler />
				</Tab>
				<Tab eventKey="directories" title="Directories" >
					<DirectoriesHandler />
				</Tab>
				<Tab eventKey="locations" title="Locations">
					<LocationsHandler />
				</Tab>
				<Tab eventKey="compare" title="Compare">
					<CompareHandler />
				</Tab>
				<Tab eventKey="admin" title="Admin">
					<AdminHandler />
				</Tab>
			</Tabs>

		  
		</div>
  );
}

export default Hashman;
