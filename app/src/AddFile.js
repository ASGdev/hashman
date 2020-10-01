import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import SumForm from './SumForm'
import LocationForm from './LocationForm'

function AddFile(props) {
	const [show, setShow] = useState(false);
	const [newFile, setNewFile] = useState({ name: "", uri: "", description: "", creationDate: "", size: "", hash: []});
	const [submitSuccess, setSubmitSuccess] = useState(null)

	const handleClose = () => {
		setSubmitSuccess(null)
		setShow(false)
	}
	const handleShow = () => setShow(true);
	
	const handlePropertyChange = (prop, value) => {

			let nf = Object.assign({}, newFile);
			nf[prop] = value
			
			setNewFile(nf);
	};
	
	const handleLocationChange = (value) => {
		handlePropertyChange("locationId", value)
	};
	
	const handleHashChange = (value) => {
		handlePropertyChange("hash", value)
	};
	
	const handleSubmit = () => {
		console.log("Submitting...")
		console.log(newFile)
		
		fetch('http://localhost:8080/api/file/', {
			method: 'POST',
			body: JSON.stringify(newFile),
			 headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  }
		})
		.then(res => {
		  if (res.status === 200) {
			setSubmitSuccess(true);
			setTimeout(() => {  setShow(false); setSubmitSuccess(null); setNewFile({ name: "", uri: "", description: "", creationDate: "", size: "", hash: []}) }, 1500);
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
				Add original file to track
			</Button>
			
			<Modal show={show} onHide={handleClose} size="lg">
			<Modal.Header closeButton>
			  <Modal.Title>Add original file</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="fileName">
						<Form.Label>Name</Form.Label>
						<Form.Control type="text" placeholder="Name" value={newFile.name} onChange={(e) => handlePropertyChange("name", e.target.value)} />
					</Form.Group>
					
					<Form.Group controlId="fileSize">
						<Form.Label>Size</Form.Label>
						<Form.Control type="number" placeholder="Size (in bytes)" value={newFile.size} onChange={(e) => handlePropertyChange("size", e.target.value)} />
					</Form.Group>
					
					<Form.Group controlId="fileDate">
						<Form.Label>Creation date</Form.Label>
						<Form.Control type="datetime-local" value={newFile.creationDate} onChange={(e) => handlePropertyChange("creationDate", e.target.value)} />
					</Form.Group>
					
					<SumForm onChange={handleHashChange} />
					
					<LocationForm onChange={handleLocationChange} />
					
					<Form.Group controlId="fileUri">
						<Form.Label>URI / Path</Form.Label>
						<Form.Control type="text" placeholder="URI" value={newFile.uri} onChange={(e) => handlePropertyChange("uri", e.target.value)} />
					</Form.Group>
					
					<Form.Group controlId="fileDescription">
						<Form.Label>Description</Form.Label>
						<Form.Control as="textarea" rows="3" value={newFile.description} onChange={(e) => handlePropertyChange("description", e.target.value)}/>
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
				Save file
			  </Button>
			</Modal.Footer>
		  </Modal>
			
		</>
	);
}

export default AddFile;