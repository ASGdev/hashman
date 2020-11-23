import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import AddFile from './AddFile'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
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

function FileListView(props) {
	return (
		<Table striped bordered hover>
			<tbody>
			{props.files.map(file => {
							if(props.filter === null || props.filter.test(file.original.name)){			
								return (
									<tr key={file._id}>
										<td>{file.original.name}</td>
										<td>{new Date(file.original.creationDate).toUTCString()}</td>
										<td>{file.original.location}</td>
										<td><Hashes data={file.original} /></td>
										<td>
											<Button variant="outline-danger">Delete</Button>
										</td>
									</tr>
								)
							}
						})
			}
			</tbody>
		</Table>
	);
}

export default FileListView;