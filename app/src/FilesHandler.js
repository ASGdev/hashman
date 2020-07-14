import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import AddFile from './AddFile'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CopiesHandler from './CopiesHandler'

function Hashes(props){
		console.log(props.data)
		if(props.data.hasOwnProperty("hash")){
			return (
				<p>
				{props.data.hash.map(hash => {
					return (
							<>
								<small class="text-muted">{hash.type}</small>
								&nbsp;
								{hash.value}
								<br />
							</>
					)
				})}
				</p>
			)
		} else {
			return(<i>No hashes</i>)
		}
}

function FilesHandler() {
	const [files, setFiles] = useState([]);
	const [selectedFile, setSelectedFile] = useState({id: null, name: null});
	
	useEffect(() => {
		fetchFiles()
	}, [])
	
	const handleSelectCard = (id, name) => {
		setSelectedFile({id, name});		
	}
	
	const fetchFiles = () => {
		fetch('http://localhost:8080/api/file/')
		  .then(res => {
			  return res.json()
		  })
		  .then(data => {
			  setFiles(data)
		  })
	}
	
	const handleDeleteFile = (e, id) => {
		e.stopPropagation()
		fetch('http://localhost:8080/api/file/' + id, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(res => {
		  if (res.status === 200) {
			setSelectedFile({id: null, name: null});
			fetchFiles()
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
					<h3>Files</h3>&nbsp;
					<AddFile onSuccess={() => fetchFiles()}/>
				</Col>
			</Row>

			<Row>&nbsp;</Row>
			
			{ files.length === 0 ? <i>No files.</i> : <></> }
			  <Row>
				<Col>
					<Container className="d-flex flex-wrap">
							{ files.map(file => {
								return (
										<Card key={file._id} onClick={() => handleSelectCard(file._id, file.original.name)} className={file._id === selectedFile.id ? "border border-primary m-2 hoverable" : "m-2 hoverable"}>
											<Card.Body>
											  <Card.Title>{file.original.name}</Card.Title>
											  <Card.Subtitle className="mb-2">
												{new Date(file.original.creationDate).toUTCString()} &sdot; {file.original.location}
											  </Card.Subtitle>
											  <Card.Text>
												<Hashes data={file.original} />
											  </Card.Text>
											</Card.Body>
											<Card.Footer className="text-muted">
												<Button variant="outline-danger" onClick={(e) => handleDeleteFile(e, file._id)}>Delete</Button>
											</Card.Footer>
										</Card>
								)
							})
							}
					</Container>
				</Col>
				<Col xl={4} lg={4} md={4} className="bd-callout bd-callout-info">
					{ selectedFile.id === null ? <i>Select file</i> : 
						<>					
							<CopiesHandler file={selectedFile.id} name={selectedFile.name} />
						</>
					}
				</Col>
			  </Row>
		</Container>
	);
}

export default FilesHandler;