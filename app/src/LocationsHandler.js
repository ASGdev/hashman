import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import AddLocation from './AddLocation'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import EditLocation from './EditLocation'

function LocationsHandler() {
	const [locations, setLocations] = useState([]);
	
	useEffect(() => {
		fetchLocations()
	}, [])
	
	const fetchLocations = () => {
		fetch('/api/location/')
		  .then(res => {
			  return res.json()
		  })
		  .then(data => {
			  setLocations(data)
		  })
	}
	
	const handleDeleteLocation = (e, id) => {
		e.stopPropagation()
		fetch('/api/location/' + id, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(res => {
		  if (res.status === 200) {
			fetchLocations()
		  } else {
		  }
		})
		.catch(err => {
			console.error("error : " + err);
		});
	}
	  
	return (
		<Container fluid className="p-3">
			<Row>
				<Col className="d-inline-flex p-2">
					<h3>Locations</h3>&nbsp;
					<AddLocation onSuccess={() => fetchLocations()} />
				</Col>
			</Row>
			
			<Row>&nbsp;</Row>
			
			{ locations.length === 0 ? <i>No locations.</i> : <></> }
			<Container fluid className="d-flex flex-wrap">
				{ locations.map(location => {
					return (
						<Card key={location._id} className="m-2">
							<Card.Body>
							  <Card.Title>{location.name}</Card.Title>
							  <Card.Text>
									<small class="text-muted">Description</small>
									&nbsp; {location.description ? location.description : <i>No description</i>}
							  </Card.Text>
							</Card.Body>
							<Card.Footer className="text-muted">
								<EditLocation id={location._id} />
								{' '}
								<Button variant="outline-danger" onClick={(e) => handleDeleteLocation(e, location._id)}>Delete</Button>
							</Card.Footer>
						</Card>
					)
				})
				}
			</Container>
			
		</Container>
	);
}

export default LocationsHandler;