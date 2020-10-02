import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import AddCopy from './AddCopy'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import EditFile from './EditFile'

function Hashes(props){
		if(props.copy.hasOwnProperty("hash")){
			return (
				props.copy.hash.map(hash => {
					return (
						<>
							<small class="text-muted">{hash.type}</small>
							&nbsp;
							{hash.value}
							<br />
						</>
					)
				})
			)
		} else {
			return(<i>No hashes</i>)
		}
}

function CopiesHandler(props) {
	const [copies, setCopies] = useState([])
	const [tabkey, setTabkey] = useState('summary');
	const [toggleEditDescription, setToggleEditDescription] = useState(false)
	
	const fetchCopies = () => {
		console.log("fetching copies");
		fetch('/api/file/' + props.file._id + '/copies')
		  .then(res => {
			  return res.json()
		  })
		  .then(data => {
			  setCopies(data)
		  })
	}
	
	useEffect(() => {
		fetchCopies()
	}, [props.file])
	
	const handleDeleteCopy = (e, id) => {
		e.stopPropagation()
		fetch('/api/file/' + props.file._id + '/copy/' + id, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(res => {
		  if (res.status === 200) {
			fetchCopies()
		  } else {
		  }
		})
		.catch(err => {
			console.error("error : " + err);
		});
	}

	const handleEditProperty = () => {
		setToggleEditDescription(!toggleEditDescription)
	}

	return (
		<>
			<div className="d-inline-flex p-2">
					<h3 class="text-muted">{props.name}</h3>&nbsp;
					<AddCopy file={props.file} onSuccess={() => fetchCopies()}/>
			</div>

			<Container>
				<Tabs activeKey={tabkey} onSelect={(k) => setTabkey(k)}>
					<Tab eventKey="summary" title="Original">
						<div className="copyProperty">
							<small className="text-muted">Location</small>
							<p>{props.file.original.locationName ? props.file.original.locationName : <i>-</i>}</p>

							<div className="copyPropertyAction">
								<Button variant="outline-primary" size="sm">Edit</Button>
							</div>
						</div>
						<div className="copyProperty">
							<small class="text-muted">Path</small>
							<p>{props.file.original.path ? props.file.original.path : <i>-</i>}</p>

							<div class="copyPropertyAction">
								<Button variant="outline-primary" size="sm">Edit</Button>
							</div>
						</div>
						<div className="copyProperty">
							<small className="text-muted">Description</small>
							{ toggleEditDescription ? 
								<EditFile id={props.file._id} field="description" value={props.file.original.description} onSuccess={() => handleEditProperty()} onCancel={() => handleEditProperty()}></EditFile>
							: 
								<>
									<p>{props.file.original.description ? props.file.original.description : <i>No description</i>}</p>
									<div className="copyPropertyAction">
										<Button variant="outline-primary" size="sm" onClick={(e) => handleEditProperty()}>{toggleEditDescription ? "Save" : "Edit"}</Button>
									</div>
								</>
							}
						</div>
					</Tab>
					<Tab eventKey="copies" title="Copies">
						{copies.map(copy => {
							return (
								<Card key={copy._id} className="m-2">
									<Card.Body>
										<Card.Title>{copy.name}</Card.Title>
										<Card.Subtitle className="mb-2">
											{copy.date ? new Date(copy.date).toUTCString() : <i>Undefined date</i>}
										</Card.Subtitle>
										<Hashes copy={copy} />
										<small class="text-muted">Description</small>
										&nbsp; {copy.description ? copy.description : <i>No description</i>}
									</Card.Body>
									<Card.Footer>
										<Button variant="outline-danger" size="sm" onClick={(e) => handleDeleteCopy(e, copy._id)}>Delete</Button>
									</Card.Footer>
								</Card>
							)
						})
						}
					</Tab>
				</Tabs>
							
			</Container>
		</>
	);
}

export default CopiesHandler;