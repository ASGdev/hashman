import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

function AddLocation(props) {
	const [show, setShow] = useState(false);
	const [newLocation, setNewLocation] = useState({ name: "", uri: "", description: ""});
	const [submitSuccess, setSubmitSuccess] = useState(null)

	const handleClose = () => {
		setSubmitSuccess(null)
		setShow(false)
	}
	const handleShow = () => setShow(true);
	
	const handlePropertyChange = (prop, value) => {

			let nl = Object.assign({}, newLocation);
			nl[prop] = value
			
			setNewLocation(nl);
	};
	
	const handleSubmit = () => {
		fetch('/api/location/', {
			method: 'POST',
			body: JSON.stringify(newLocation),
			 headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  }
		})
		.then(res => {
		  if (res.status === 200) {
			setSubmitSuccess(true);
			setTimeout(() => { setShow(false); setNewLocation({ name: "", uri: "", description: ""}); setSubmitSuccess(null) }, 1500);
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
			<Button variant="primary" onClick={handleShow}>
				Add location
			</Button>
			
			<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
			  <Modal.Title>Add location</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formBasicEmail">
						<Form.Label>Name</Form.Label>
						<Form.Control type="text" placeholder="Enter name" value={newLocation.name} onChange={(e) => handlePropertyChange("name", e.target.value)} />
					</Form.Group>
					
					<Form.Group controlId="formBasicEmz">
						<Form.Label>URI</Form.Label>
						<Form.Control type="text" placeholder="Enter URI" value={newLocation.uri} onChange={(e) => handlePropertyChange("uri", e.target.value)} />
					</Form.Group>
					
					<Form.Group controlId="exampleForm.ControlTextarea1">
						<Form.Label>Description</Form.Label>
						<Form.Control as="textarea" rows="3" value={newLocation.description} onChange={(e) => handlePropertyChange("description", e.target.value)}/>
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
				Save
			  </Button>
			</Modal.Footer>
		  </Modal>
			
		</>
	);
}

export default AddLocation;