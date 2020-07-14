import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'

function SumForm(props) {
	const [show, setShow] = useState(false);
	const [sums, setSums] = useState([]);
	const [newSum, setNewSum] = useState({type: "", value: ""})
	const availableSumTypes = ["crc32", "md5", "sha1", "sha256"]
	
	const handlePropertyChange = (prop, value) => {

			let nf = Object.assign({}, newSum);
			nf[prop] = value
			
			setNewSum(nf);
			console.log(value)
	};
	
	const handleSubmitSum = () => {
		let s = sums;
		s.push(newSum)
		setSums(s)
		setNewSum({type: "", value: ""})
		props.onChange(sums);
	}
	
	const handleRemoveSum = (stype) => {
		let ss = sums;
		let ns = ss.filter(s => s.type !== stype);
		setSums(ns)
	}
	  
	return (
		<>
			<Form.Group>
				<Form.Label>Hash</Form.Label>
				
				<Table striped bordered hover size="sm">
				  <tbody>
				  {
					  sums.map(sum => {
							return (<tr>
								<td>{sum.type}</td>
								<td>{sum.value}</td>
								<td><Button variant="outline-danger" size="sm" onClick={() => handleRemoveSum(sum.type)}>Remove</Button></td>
							</tr>)
					  })
				  }
				  </tbody>
				</Table>
				<Row>
					<Col>
						<Form.Control as="select" value={newSum.type} onChange={(e) => handlePropertyChange("type", e.target.value)}>
								<option>-- Select checksum type</option>
							  { availableSumTypes.map((type, i) => <option key={i} value={type}>{type}</option>) }
						</Form.Control>	
					</Col>
					<Col>
						<Form.Control type="text" placeholder="sum value" value={newSum.value} onChange={(e) => handlePropertyChange("value", e.target.value)} />	
					</Col>
					<Col>
						<Button onClick={handleSubmitSum}>Submit</Button>
					</Col>
				</Row>
			</Form.Group>
								
						
						
		</>
	);
}

export default SumForm;