import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import AddCopy from './AddCopy'

function Hashes(props){
		if(props.copy.hasOwnProperty("hash")){
			return (
				<p>
				{props.copy.hash.map(hash => {
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

function CopiesHandler(props) {
	const [copies, setCopies] = useState([])
	
	const fetchCopies = () => {
		console.log("fetching copies");
		fetch('http://localhost:8080/api/file/' + props.file + '/copies')
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
		fetch('http://localhost:8080/api/file/' + props.file + '/copy/' + id, {
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

	return (
		<>
			<div className="d-inline-flex p-2">
					<h3 class="text-muted">{props.name}</h3>&nbsp;
					<AddCopy file={props.file} onSuccess={() => fetchCopies()}/>
			</div>
			
			<Container className="d-flex flex-wrap">
					{ copies.map(copy => {
							return (
								<Card key={copy._id} className="m-2">
									<Card.Body>
									  <Card.Title>{copy.name}</Card.Title>
									  <Card.Subtitle className="mb-2 text-muted">{copy.date}</Card.Subtitle>
										<Hashes copy={copy} />
										
									</Card.Body>
									<Card.Footer>
									  <Button variant="outline-danger" size="sm" onClick={(e) => handleDeleteCopy(e, copy._id)}>Delete</Button>
									</Card.Footer>									
								</Card>
							)
						})
						}					
			</Container>
		</>
	);
}

export default CopiesHandler;