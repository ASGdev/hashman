import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import LocationsHandler from './LocationsHandler'
import FilesHandler from './FilesHandler'
import AdminHandler from './AdminHandler'
import Hashman from './Hashman'
import Login from './Login'
import Logout from './Logout'
import Auth from './Auth'
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
	fetch('/auth/checkToken')
        .then(res => {
          if (res.status === 200) {
            setIsLoggedIn(true)
          } else {
            const error = new Error(res.error)
            throw error;
          }
        })
        .catch(err => {
          console.error(err)
          setIsLoggedIn(false)
        });
  }, [])
	
	
  return (
	<>
		<Navbar bg="dark" variant="dark">
			<Navbar.Brand>HashMan</Navbar.Brand>
			{ (isLoggedIn) ? 
				<Nav.Link href="/logout"><Button variant="outline-info">Logout</Button></Nav.Link> :
				<Nav.Link href="/login"><Button variant="outline-info">Login</Button></Nav.Link>
			}
		</Navbar>	
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Auth(Hashman)} />
				<Route path="/login" component={Login} />
				<Route path="/logout" component={Logout} />
			</Switch>
		</BrowserRouter>
	</>
  );
}

export default App;
