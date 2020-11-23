import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'

function ViewType(props) {
	const [isListView, setIsListView] = useState(false)
	const listViewIconRef = useRef(null);
	const cardViewIconRef = useRef(null);
	
	const handleViewChange = (e) => {
		const listViewIcon = listViewIconRef.current
		const cardViewIcon = cardViewIconRef.current
		
		let type = e.target.dataset.view

		if(e.target.tagName !== "LI"){
			type = e.target.parentNode.dataset.view
		}
		if(type === "card"){
			props.handleViewTypeChange(false)
			listViewIcon.classList.remove('selectedFilter')
			cardViewIcon.classList.add('selectedFilter');
		} else {
			props.handleViewTypeChange(true)
			cardViewIcon.classList.remove('selectedFilter')
			listViewIcon.classList.add('selectedFilter')
		}		
	}
	
	return (
		<ul className="list-inline filterContainer" onClick={(e) => handleViewChange(e)}>
			<li className="list-inline-item" data-view="card" ref={cardViewIconRef}>
				<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-view-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2zm0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14z"/>
				</svg>
			</li>
			<li className="list-inline-item" data-view="list" ref={listViewIconRef}>
				<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
				</svg>
			</li>
		</ul>
	);
}

export default ViewType;