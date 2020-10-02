import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

function EditLocation(props) {
	const [show, setShow] = useState(false);
	const [location, setLocation] = useState({ name: "", uri: "", description: ""});
	const [submitSuccess, setSubmitSuccess] = useState(null)

	const handleClose = () => {
		setSubmitSuccess(null)
		setShow(false)
	}
	const handleShow = () => setShow(true);
	
	const handlePropertyChange = (prop, value) => {

			let nl = Object.assign({}, location);
			nl[prop] = value
			
			setLocation(nl);
	};

	useEffect(() => {
		console.log("Fetching data for edition")
		fetch('/api/location/' + props.id)
			.then(res => {
				return res.json()
			})
			.then(data => {
				setLocation(data)
			})
	}, [])
	
	const handleSubmit = () => {
		fetch('/api/location/' + props.id, {
			method: 'PUT',
			body: JSON.stringify(location),
			 headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  }
		})
		.then(res => {
		  if (res.status === 200) {
			setSubmitSuccess(true);
			setTimeout(() => { setShow(false); setSubmitSuccess(null) }, 1500);
			props.onSuccess();
		  } else {
			setSubmitSuccess(false);
		  }
		})
		.catch(err => {
			setSubmitSuccess(false);
			console.error("error : " + err);
		});
		
	};
	  
	return (
		<>
			<Button variant="outline-primary" onClick={handleShow}>
				Edit
			</Button>
			
			<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
			  <Modal.Title>Edit location</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formBasicEmail">
						<Form.Label>Name</Form.Label>
						<Form.Control type="text" placeholder="Enter name" value={location.name} onChange={(e) => handlePropertyChange("name", e.target.value)} />
					</Form.Group>
					
					<Form.Group controlId="formBasicEmz">
						<Form.Label>URI</Form.Label>
						<Form.Control type="text" placeholder="Enter URI" value={location.uri} onChange={(e) => handlePropertyChange("uri", e.target.value)} />
					</Form.Group>
					
					<Form.Group controlId="exampleForm.ControlTextarea1">
						<Form.Label>Description</Form.Label>
						<Form.Control as="textarea" rows="3" value={location.description} onChange={(e) => handlePropertyChange("description", e.target.value)}/>
					  </Form.Group>
				</Form>
				
				{ (submitSuccess === true) ? <Alert variant="success">Location created</Alert> : <></> }
				{ (submitSuccess === false) ? <Alert variant="danger">Error creating location</Alert> : <></> }
			
			</Modal.Body>
			<Modal.Footer>
			  <Button variant="secondary" onClick={handleClose}>
				Close
			  </Button>
			  <Button variant="primary" onClick={handleSubmit}>
				Save changes
			  </Button>
			</Modal.Footer>
		  </Modal>
			
		</>
	);
}

export default EditLocation;