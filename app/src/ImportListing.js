import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Col from 'react-bootstrap/Col'
import { ProcessInput } from './utils/ListingProcess'

function ImportListing(props) {
	const [key, setKey] = useState('text')
	const [show, setShow] = useState(false)
	const [inputType, setInputType] = useState("xsv")
	const [fieldsPosition, setFieldsPosition] = useState("htf")
	const [xsvSeparator, setXsvSeparator] = useState("tab")
	const [dirListingContent, setDirListingContent] = useState("")
	const [dirListingName, setDirListingName] = useState("")
	const [dirListingDescr, setDirListingDescr] = useState("")
	const [submitSuccess, setSubmitSuccess] = useState(null)

	const handleClose = () => {
		setSubmitSuccess(null)
		setShow(false)
	}
	const handleShow = () => setShow(true);
	
	const handleInputTypeChange = (e) => {
		setInputType(e.target.value)
	}
	
	const handleFieldsPositionChange = (e) => {
		setFieldsPosition(e.target.value)
	}
	
	const handleXsvSeparatorChange = (e) => {
		setXsvSeparator(e.target.value)
	}
	
	const handleDirListingContentChange = (e) => {
		setDirListingContent(e.target.value)
	}
	
	const handleDirListingNameChange = (e) => {
		setDirListingName(e.target.value)
	}
	
	const handleDirListingDescrChange = (e) => {
		setDirListingDescr(e.target.value)
	}
	
	const resetForm = () => {
		setDirListingName("")
		setDirListingContent("")
		setDirListingDescr("")
	}

	const handleSubmit = async () => {
		console.log("processing")
		
		try {
			const d = await ProcessInput(inputType, xsvSeparator, fieldsPosition, dirListingContent)
			
			console.log(d)
			
			const body = {
				n: dirListingName,
				de: dirListingDescr,
				s: d.length,
				d
			}
			
			console.log(body)
			
			fetch('/api/directory/', {
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			})
			.then(res => {
				if (res.status === 200) {
					console.log("send ok")
					setSubmitSuccess(true)
					setTimeout(() => { 
						setShow(false)
						resetForm()
					}, 1500)
					props.onSuccess()
				} else {
					setSubmitSuccess(false);
				}
			})
			.catch(err => {
				setSubmitSuccess(false);
				console.error("error : " + err);
			});
			
			
		} catch (e) {
			console.error(e)
			setSubmitSuccess(false);
		}
	};
	  
	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				Import listing
			</Button>
			
			<Modal show={show} size="lg" onHide={handleClose}>
			<Modal.Header closeButton>
			  <Modal.Title>Import listing</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Tabs activeKey={key} onSelect={(k) => setKey(k)}>
					<Tab eventKey="text" title="Text input" >
						<Alert variant="info">
							Select input type : 
							<ul>
								<li>JSON : {"[ { file: <filename>, hash: <hash> } ]"}</li>
								<li>xSV : {"<filename><sep><hash> where sep is \",\" or [tab]"}</li>
							</ul>
						</Alert>
						<Form>
							<Form.Row>
								<Col>
									<Form.Group controlId="formBasicEmail">
										<Form.Label>Input type</Form.Label>
										<Form.Check 
											type="radio" 
											inline 
											label="JSON"
											value="json"
											checked={inputType === "json"}
											onChange={handleInputTypeChange}
										/>
										<Form.Check
											type="radio"
											inline
											label="xSV"
											value="xsv"
											checked={inputType === "xsv"}
											onChange={handleInputTypeChange}
										/>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="formBasicEmail">
										<Form.Label>Separator :</Form.Label>
										<Form.Control
											as="select"
											id="inlineFormCustomSelect"
											value={xsvSeparator}
											onChange={handleXsvSeparatorChange}
										>
											<option value="comma" disabled>comma (",")</option>
											<option value="tab">tab ("\t")</option>
										</Form.Control>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="formBasicEmz">
										<Form.Label>Position</Form.Label>
										<Form.Check 
											type="radio" 
											inline 
											label="hash then filename"
											value="htf"
											checked={fieldsPosition === "htf"}
											onChange={handleFieldsPositionChange}
										/>
										<Form.Check
											type="radio"
											inline
											label="filename then hash"
											value="fth"
											checked={fieldsPosition === "fth"}
											onChange={handleFieldsPositionChange}
										/>
									</Form.Group>
								</Col>
							</Form.Row>
							
							<Form.Group controlId="formBasicEmz">
								<Form.Label>Content</Form.Label>
								<Form.Control as="textarea"
									rows={5}
									value={dirListingContent}
									onChange={handleDirListingContentChange}
								/>
							</Form.Group>
							
							<Form.Group controlId="formBasicEmz89">
								<Form.Label>Directory name</Form.Label>
								<Form.Control type="text" placeholder="Directory name"
									value={dirListingName}
									onChange={handleDirListingNameChange}
								/>
							</Form.Group>
							
							<Form.Group controlId="formBasicEmz88">
								<Form.Label>Directory description</Form.Label>
								<Form.Control as="textarea"
									rows={5}
									value={dirListingDescr}
									onChange={handleDirListingDescrChange}
								/>
							</Form.Group>

						</Form>
					</Tab>
					<Tab eventKey="file" title="File input" >
						<Alert variant="warning">
							Not implemented yet.
						</Alert>
					</Tab>
				</Tabs>
				
				{ (submitSuccess === true) ? <Alert variant="success">Listing imported.</Alert> : <></> }
				{ (submitSuccess === false) ? <Alert variant="danger">Error importing listing.</Alert> : <></> }
			
			</Modal.Body>
			<Modal.Footer>
			  <Button variant="secondary" onClick={handleClose}>
				Close
			  </Button>
			  <Button variant="primary" onClick={handleSubmit}>
				Process and save
			  </Button>
			</Modal.Footer>
		  </Modal>
			
		</>
	);
}

export default ImportListing;