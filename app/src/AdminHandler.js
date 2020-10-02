import React from 'react';
import Button from 'react-bootstrap/Button'
import FileSaver from 'file-saver';

function AdminHandler() {
	const exportData = async () => {
		let combined = {
			files: [],
			locations: []
		}
		
		let filesQuery = await fetch('/api/file');
		let filesData = await filesQuery.json()
		
		combined.files = filesData;
		
		let locationsQuery = await fetch('/api/location');
		let locationsData = await locationsQuery.json()
		
		combined.locations = locationsData
		combined = JSON.stringify(combined)
			
		let blob = new Blob([combined], {type: "application/json"});
			
		FileSaver.saveAs(blob, "hashman-data.json");
	}
	  
	return (
		<Button variant="primary" onClick={() => exportData()}>Export data</Button>
	);
}

export default AdminHandler;