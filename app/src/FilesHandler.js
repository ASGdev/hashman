import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import AddFile from './AddFile'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CopiesHandler from './CopiesHandler'
import NameFilter from './NameFilter'

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
	const [refreshData, setRefreshData] = useState(true)
	const [selectedFile, setSelectedFile] = useState({_id: null});
	const [filterValue, setFilterValue] = useState(null)
	const [allFiles, setAllFiles] = useState([])
	
	useEffect(() => {
		if(refreshData){
			fetchFiles()
		}
	}, [])
	
	const handleSelectCard = (file) => {
		setSelectedFile(file);		
	}
	
	const fetchFiles = () => {
		fetch('http://localhost:8080/api/file/')
		  .then(res => {
			  return res.json()
		  })
		  .then(data => {
			  setFiles(data)
			  setRefreshData(false)
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
			setSelectedFile({ _id: null });
			fetchFiles()
		  } else {
		  }
		})
		.catch(err => {
			console.error("error : " + err);
		});
	}
	
	const handleNameFilterChange = (value) => {
		console.log(value)
		if(value === null){
			setFilterValue(null)
			setRefreshData(true)
		} else if(value === "num"){
			setFilterValue(new RegExp('^\d'))
		} else {
			setFilterValue(new RegExp('^' + value, 'i'))
		}
	}
	  
	return (
		<Container fluid className="p-3">
			<Row>
				<Col className="d-inline-flex p-2">
					<h3>Files</h3>&nbsp;
					<AddFile onSuccess={() => fetchFiles()}/>
				</Col>
			</Row>

			<Row><Container className="d-flex flex-wrap"><NameFilter handleNameFilterChange={handleNameFilterChange} /></Container></Row>
			
			{ files.length === 0 ? <i>No files.</i> : <></> }
			  <Row>
				<Col>
					<Container className="d-flex flex-wrap">
						{files.map(file => {
							if(filterValue === null || filterValue.test(file.original.name)){
								return (	
									<Card key={file._id} onClick={() => handleSelectCard(file)} className={file._id === selectedFile._id ? "border border-primary m-2 hoverable" : "m-2 hoverable"}>
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
							}
						})
						}	
					</Container>
				</Col>
				<Col xl={4} lg={4} md={4} className="separator">
					{ selectedFile._id === null ? <i>Select file</i> : 
						<>					
							<CopiesHandler file={selectedFile} />
						</>
					}
				</Col>
			  </Row>
		</Container>
	);
}

export default FilesHandler;