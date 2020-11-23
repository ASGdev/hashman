import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import AddFile from './AddFile'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import CopiesHandler from './CopiesHandler'
import NameFilter from './NameFilter'
import ViewType from './ViewType'
import FileListView from './FileListView'

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

function DirectoriesHandler() {
	const [directories, setDirectories] = useState([]);
	const [refreshData, setRefreshData] = useState(true)
	const [selectedFile, setSelectedFile] = useState({_id: null})
	const [filterValue, setFilterValue] = useState(null)
	const [allFiles, setAllFiles] = useState([])
	const [isListView, setIsListView] = useState(false)
	
	useEffect(() => {
		if(refreshData){
			fetchDirectories()
		}
	}, [])
	
	const handleSelectCard = (file) => {
		setSelectedFile(file);		
	}
	
	const fetchDirectories = () => {
		fetch('/api/directory/')
		  .then(res => {
			  return res.json()
		  })
		  .then(data => {
			  setDirectories(data)
			  setRefreshData(false)
		  })
	}
	
	const handleDeleteFile = (e, id) => {
		e.stopPropagation()
		fetch('/api/file/' + id, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(res => {
		  if (res.status === 200) {
			setSelectedFile({ _id: null });
			fetchDirectories()
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
	
	const handleViewTypeChange = (value) => {
		if(value){
			setIsListView(true)
		} else {
			setIsListView(false)
		}
	}
	  
	return (
		<Container fluid className="p-3">
			<Row>
				<Col className="d-inline-flex p-2">
					<h3>Directories</h3>
				</Col>
			</Row>

			<Row>
				<Col>
					<NameFilter handleNameFilterChange={handleNameFilterChange} />
				</Col>
				<Col>
					<ViewType handleViewTypeChange={handleViewTypeChange} />
				</Col>
			</Row>
			
			{ directories.length === 0 ? <i>No directories.</i> : <></> }
			  <Row>
				<Col>
					<Container className="d-flex flex-wrap">
					{ (isListView) ?
						(filterValue === null) ?
							<FileListView files={directories} filter={filterValue} />
							: <FileListView files={directories} filter={filterValue} />
						:
						directories.map(file => {
							if(filterValue === null || filterValue.test(file.original.name)){	
								return (	
										<Card key={file._id} onClick={() => handleSelectCard(file)} className={file._id === selectedFile._id ? "border border-primary m-2 hoverable" : "m-2 hoverable"}>
											<Card.Body>
												<Card.Title>{file.original.name}</Card.Title>
												<Card.Subtitle className="mb-2">
													{new Date(file.original.postDate).toUTCString()} &sdot; {file.original.locationName}
												</Card.Subtitle>
												<Card.Text>
													<p>Size : {file.original.size}</p>
													<p>Description : {file.original.description}</p>
												</Card.Text>
											</Card.Body>
											<Card.Footer className="text-muted">
												<Button variant="outline">View content</Button>
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

export default DirectoriesHandler;