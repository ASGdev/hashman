import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function CompareHandler() {
	const [directoriesList, setDirectoriesList] = useState([])
	const [refreshData, setRefreshData] = useState(true)
	const [selectedDirectoryA, setSelectedDirectoryA] = useState(null)
	const [selectedDirectoryB, setSelectedDirectoryB] = useState(null)
	const [compareResult, setCompareResult] = useState(null)
	
	useEffect(() => {
		if(refreshData){
			fetchDirectoriesList()
		}
	}, [])
	
	const fetchDirectoriesList = () => {
		fetch('/api/directory/list')
		  .then(res => {
			  return res.json()
		  })
		  .then(data => {
			  setDirectoriesList(data)
			  console.log(data)
			  setRefreshData(false)
		  })
	}
	
	const populateSelectOptions = () => {
		return directoriesList.map(dir => { return <option value={dir._id}>{dir.name}&nbsp;{dir.path}@{dir.locationName}</option> })
	}
	
	const selectDirectoryA = (event) => {
		console.log(event.target.value)
		setSelectedDirectoryA(event.target.value)
	}
	
	const selectDirectoryB = (event) => {
		console.log(event.target.value)
		setSelectedDirectoryB(event.target.value)
	}
	
	const compare = () => {
		fetch('/api/directory/compare', {
			method: 'POST',
			body: JSON.stringify({ dirA: selectedDirectoryA, dirB: selectedDirectoryB }),
			 headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  }
		})
		.then(res => {
		  if (res.status === 200) {
			return res.json()
		  } else {
		  }
		})
		.then(data => {
			setCompareResult(data)
		})
		.catch(err => {
			console.error("error : " + err);
		});
		
	}
	

	return (
		(directoriesList.length <= 1) ? "No directories to compare" : 
		<>
			<p>Select a directory : </p>
			<Form.Control as="select" value={selectedDirectoryA} onChange={selectDirectoryA}>
				<option>-- select</option>
				{ populateSelectOptions() }
			</Form.Control>
			
			<p>to compare with directory : </p>
			<Form.Control as="select" value={selectedDirectoryB} onChange={selectDirectoryB}>
				<option>-- select</option>
				{ populateSelectOptions() }
			</Form.Control>
			
			<Button variant="primary" onClick={() => compare()}>Compare</Button>
			
			{ (compareResult) ? 
				<>
					<h4>Compare results</h4>
					{ (compareResult.sizeUnmatch) ? <p>Directory content mismatch</p> : "" }
					{ (compareResult.fileNotFoundInTarget.length !== 0) ? 
						<>
							<p>Files not found in target directory :</p>
							<ul>
								{ compareResult.fileNotFoundInTarget.map(path => <li>{path}</li>) }
							</ul>
						</>
						: ""
					}
					{ (compareResult.fileNotFoundInSource.length !== 0) ? 
						<>
							<p>Files not found in source directory :</p>
							<ul>
								{ compareResult.fileNotFoundInSource.map(path => <li>{path}</li>) }
							</ul>
						</>
						: ""
					}
					
					{ (compareResult.fileChecksumUnmatch.length !== 0) ? 
						<>
							<p>Checksum(s) mismatch :</p>
							<ul>
								{ 
									compareResult.fileChecksumUnmatch.map(file =>
										<li>{ file.path }
											<ul>
												<li>Hash in source : { file.sourceFileHash }</li>
												<li>Hash in target : { file.targetFileHash }</li>
											</ul>
										</li>
									)
								}
							</ul>
						</>
						: ""
					}
					
					
				</>
			
				: <i>No results</i>
			}
		</>
	);
}

export default CompareHandler;