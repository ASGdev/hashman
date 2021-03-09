import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function SearchForm(props) {
	const [value, setValue] = useState(null)
	const [isHash, setIsHash] = useState(false)
	const [isStrict, setIsStrict] = useState(false)
	
	const handleSubmit = () => {
		props.onSearch(value, isHash, isStrict);	
	};
	
	const handleValueChange = (e) => {
		setValue(e.target.value)
	};
	
	const handleHashOptionChange = (e) => {
		setIsHash(e.target.checked)
	};
	
	const handleStrictOptionChange = (e) => {
		setIsStrict(e.target.checked)
	};
	
	useEffect(() => {
	}, [])
	  
	return (
		<Form>
			<Form.Group>
				<Form.Label>File name or hash</Form.Label>
				<Form.Control type="text" value={value} onChange={handleValueChange} placeholder="Enter file name or hash as text" />
			</Form.Group>
			<Form.Row>
				<Col>
					<Form.Check inline type="checkbox" checked={isHash} onChange={handleHashOptionChange} label="Search by hash" />
				</Col>
				<Col>
					<Form.Check inline type="checkbox" checked={isStrict} onChange={handleStrictOptionChange} label="Strict search" />
				</Col>
			</Form.Row>
			<Button variant="primary" onClick={handleSubmit}>
				Search
			</Button>
		</Form>
	);
}

export default SearchForm;