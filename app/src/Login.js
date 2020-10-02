import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom";

function Login() {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  let history = useHistory();

  const handleMailInputChange = (event) => {
    setEmail(event.target.value)
  }
  
  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value)
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/auth/authenticate', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => {
      if (res.status === 200 || res.status === 204) {
		window.location.assign("/")
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error logging in please try again');
    });
  }
  
  return (
	<Container>
		<Row>&nbsp;</Row>
		<form onSubmit={handleSubmit}>
		<Row>
			<Col></Col>
			<Col xs={6} className="text-center">
				<h1>Login</h1>
			</Col>
			<Col></Col>
		</Row>
		<Row>&nbsp;</Row>
		<Row>
			<Col></Col>
			<Col xs={6} className="text-center">
				<input
							type="email"
							name="email"
							placeholder="Enter email"
							value={email}
							onChange={handleMailInputChange}
							required
							size="lg"
							/>
			</Col>
			<Col></Col>
		</Row>
		<Row>&nbsp;</Row>
		<Row>
					<Col></Col>
						<Col xs={6} className="text-center">
							<input
					  type="password"
					  name="password"
					  placeholder="Enter password"
					  value={password}
					  onChange={handlePasswordInputChange}
					  required
					  size="lg"
						/>
						</Col>
						<Col></Col>
		</Row>
		<Row>&nbsp;</Row>
		<Row>
						<Col></Col>
						<Col xs={6} className="text-center">
							<input type="submit" value="Submit" size="lg"/>
						</Col>
						<Col></Col>

					
		</Row>
		</form>
	</Container>
  );
}

export default Login;
