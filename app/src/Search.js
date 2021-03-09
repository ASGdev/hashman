import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import AddLocation from './AddLocation'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SearchForm from './SearchForm'

function Hashes(props){
		console.log(props.data)
		if(props.data.hasOwnProperty("hash")){
			return (
				<div>
				{props.data.hash.map(hash => {
					return (
							<div>
								<small class="text-muted">{hash.type}</small>
								&nbsp;
								{hash.value}
								<br />
							</div>
					)
				})}
				</div>
			)
		} else {
			return(<i>No hashes</i>)
		}
}

function Search() {
	const [searchData, setSearchData] = useState([]);
	
	useEffect(() => {
	}, [])
	
	const submitSearch = (value, isHash, isStrict) => {
		console.log(value)
		
		let searchParams = new URLSearchParams()
		searchParams.append("q", value)
		searchParams.append("h", isHash)
		searchParams.append("s", isStrict)
		
		fetch('/api/file?' + searchParams.toString(), {
			method: 'GET'
		})
		.then(res => {
			return res.json()
		})
		.then(data => {
			console.log(data)
			setSearchData(data)
		})
		.catch(err => {
			console.error("error : " + err);
		});
		
		fetch('/api/directory?' + searchParams.toString(), {
			method: 'GET'
		})
		.then(res => {
			return res.json()
		})
		.then(data => {
			console.log(data)
			//setSearchData(data)
		})
		.catch(err => {
			console.error("error : " + err);
		});
	}
	  
	return (
		<Container fluid className="p-3">
			<Row>
				<Col className="d-inline-flex p-2">
					<h3>Search</h3>&nbsp;
				</Col>
			</Row>
			
			<Row>&nbsp;</Row>

			<Container fluid className="d-flex flex-wrap">
				<Row>
					<Col>
						<SearchForm onSearch={submitSearch} />
					</Col>
					<Col>
					{ (searchData.length === 0) ?
						<i>Search returned no data.</i>
						:
						searchData.map(file => {
								return (	
										<Card key={file._id}>
											<Card.Body>
												<Card.Title>{file.original.name}</Card.Title>
												<Card.Subtitle className="mb-2">
													{new Date(file.original.creationDate).toUTCString()} &sdot; {file.original.location}
												</Card.Subtitle>
												<Card.Text>
													<Hashes data={file.original} />
												</Card.Text>
											</Card.Body>
										</Card>
								)
						})			 
					}
					</Col>
				</Row>
			</Container>
			
		</Container>
	);
}

export default Search;