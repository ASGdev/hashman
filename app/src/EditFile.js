import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

function EditFile(props) {
	const [location, setLocation] = useState({ name: "", uri: "", description: ""});
	const [newValue, setNewValue] = useState(props.value)
	
	const handlePropertyChange = (e) => {
		setNewValue(e.target.value)
	};

	const handleSubmit = () => {
		let update = {}
		update[props.field] = newValue

		fetch('http://localhost:8080/api/file/' + props.id, {
			method: 'PUT',
			body: JSON.stringify(update),
			 headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  }
		})
		.then(res => {
		  if (res.status === 200) {
			props.onSuccess();
		  } else {
		  }
		})
		.catch(err => {
			console.error("error : " + err);
		});
		
	};

	const renderInput = () => {
		switch (props.field) {
			case "description":
				return (
					<textarea value={newValue} onChange={handlePropertyChange} />
				);
				break;
			case "path":
				return (
					<input type="text" value={newValue} onChange={handlePropertyChange} />
				);
				break;
		}
	}
	  
	return (
		<>
			{ renderInput() }

			<div class="copyPropertyAction">
				<Button variant="outline-primary" size="sm" onClick={() => handleSubmit()}>Save</Button>{' '}
				<Button variant="outline-danger" size="sm" onClick={() => props.onCancel()}>Cancel</Button>
			</div>
		</>
		
	);
}

export default EditFile;