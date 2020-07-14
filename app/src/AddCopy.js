import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import SumForm from './SumForm'
import LocationForm from './LocationForm'

function AddCopy(props) {
	const [show, setShow] = useState(false);
	const [newCopy, setNewCopy] = useState({ name: "", uri: "", description: "", hash: []});
	const [submitSuccess, setSubmitSuccess] = useState(null)

	const handleClose = () => {
		setSubmitSuccess(null)
		setShow(false)
	}
	const handleShow = () => setShow(true);
	
	const handlePropertyChange = (prop, value) => {
		let nf = Object.assign({}, newCopy);
		nf[prop] = value
			
		setNewCopy(nf);
	};
	
	const handleLocationChange = (value) => {
		handlePropertyChange("locationId", value)
	};
	
	const handleHashChange = (value) => {
		handlePropertyChange("hash", value)
	};
	
	const handleSubmit = () => {
		fetch('http://localhost:8080/api/file/' + props.file + '/copy', {
			method: 'POST',
			body: JSON.stringify(newCopy),
			 headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  }
		})
		.then(res => {
		  if (res.status === 200) {
			setSubmitSuccess(true);
			setTimeout(() => { setShow(false); setNewCopy({ name: "", uri: "", description: "", hash: []}); setSubmitSuccess(null) }, 1500);
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
				Add copy
			</Button>
			
			<Modal show={show} onHide={handleClose} size="lg">
			<Modal.Header closeButton>
			  <Modal.Title>Add copy</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formBasicEmail">
						<Form.Label>Name</Form.Label>
						<Form.Control type="text" placeholder="Name" value={newCopy.name} onChange={(e) => handlePropertyChange("name", e.target.value)} />
					</Form.Group>
					
					<Form.Group controlId="formBasicEmz">
						<Form.Label>URI</Form.Label>
						<Form.Control type="text" placeholder="URI" value={newCopy.uri} onChange={(e) => handlePropertyChange("uri", e.target.value)} />
					</Form.Group>
					
					<Form.Group controlId="formBasicEmzzz">
						<Form.Label>Check date</Form.Label>
						<Form.Control type="datetime-local" value={newCopy.date} onChange={(e) => handlePropertyChange("date", e.target.value)} />
					</Form.Group>
					
					<SumForm onChange={handleHashChange} />
					
					<LocationForm onChange={handleLocationChange} />
					
					<Form.Group controlId="exampleForm.ControlTextarea1">
						<Form.Check type="checkbox" label="Temporary file" checked={newCopy.isTemporary} onChange={(e) => handlePropertyChange("isTemporary", e.target.checked)} />
					 </Form.Group>
				</Form>
				
				{ (submitSuccess === true) ? <Alert variant="success">File created</Alert> : <></> }
				{ (submitSuccess === false) ? <Alert variant="danger">Error creating file</Alert> : <></> }
			
			</Modal.Body>
			<Modal.Footer>
			  <Button variant="secondary" onClick={handleClose}>
				Close
			  </Button>
			  <Button variant="primary" onClick={handleSubmit}>
				Submit
			  </Button>
			</Modal.Footer>
		  </Modal>
			
		</>
	);
}

export default AddCopy;