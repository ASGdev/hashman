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

function DirectoryDetail({dir}) {
	const [tabkey, setTabkey] = useState('summary');
	const [toggleEditDescription, setToggleEditDescription] = useState(false)
	const [directoryData, setDirectoryData] = useState(null)
	
	useEffect(() => {
		fetchDirectoryData()
	}, [dir])
	
	const fetchDirectoryData = () => {
		fetch('/api/directory/' + dir)
		  .then(res => {
			  return res.json()
		  })
		  .then(data => {
			  setDirectoryData(data)
		  })
	}
	
	const handleDeleteCopy = (e, id) => {
		e.stopPropagation()
		/*fetch('/api/file/' + file._id + '/copy/' + id, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(res => {
		  if (res.status === 200) {
		  } else {
		  }
		})
		.catch(err => {
			console.error("error : " + err);
		});*/
	}

	const handleEditProperty = () => {
		setToggleEditDescription(!toggleEditDescription)
	}

	return (
		<>
			<Container>
			{ (directoryData) ?
				<Tabs activeKey={tabkey} onSelect={(k) => setTabkey(k)}>
					<Tab eventKey="summary" title="Summary">
						<p>Post date : {directoryData.original.postDate ? new Date(directoryData.original.postDate).toUTCString() : <i>-</i>}</p>
						<p>Location : {directoryData.original.locationName ? directoryData.original.locationName : <i>-</i>}</p>
						<p>Content : {directoryData.original.size ? <span>{directoryData.original.size} items</span> : <i>-</i>}</p>
					</Tab>
					<Tab eventKey="content" title="Content">
					
						<table>
							<thead>
								<tr>
									<th>Path</th>
									<th>Hash</th>
								</tr>
							</thead>
							<tbody>
								{
									directoryData.original.content.map(file => 
										<tr>
											<td>{ file.original.path }</td>
											<td>{ file.original.hash[0].value }</td>
										</tr>
									)
								}
							</tbody>
						</table>
					</Tab>
				</Tabs>
				: <i>No data</i>
			}
			</Container>
		</>
	);
}

export default DirectoryDetail;