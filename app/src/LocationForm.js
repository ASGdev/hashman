import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'

function LocationForm(props) {
	const [locations, setLocations] = useState([])
	const [selectedLocation, setSelectedLocation] = useState("")
	
	const handleChange = (value) => {
		setSelectedLocation(value)
		props.onChange(value);	
	};
	
	useEffect(() => {
		fetch('http://localhost:8080/api/location')
		  .then(res => {
			  return res.json()
		  })
		  .then(data => {
			  setLocations(data)
		  })
	}, [])
	  
	return (
		<>
			<Form.Group>
				<Form.Label>Location</Form.Label>
				<Form.Control as="select" value={selectedLocation} onChange={(e) => handleChange(e.target.value)}>
					<option value="null">-- Select location</option>
					{ locations.map(loc => <option key={loc._id} value={loc._id}>{loc.name}</option>) }
				</Form.Control>
			</Form.Group>
		</>
	);
}

export default LocationForm;