import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import AddCopy from './AddCopy'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import EditFile from './EditFile'

function NameFilter(props) {
	const [character, setCharacter] = useState(null)
	const [previousFilter, setPreviousFilter] = useState(null)
	
	const handleCharacterChange = (e) => {
		if(e.target.tagName === "LI"){
			if(previousFilter !== null){
				previousFilter.classList.remove('selectedFilter')
			}
			setPreviousFilter(e.target)
			e.target.classList.add('selectedFilter');
			if(e.target.dataset.value){
				if(e.target.dataset.value === "null"){
					props.handleNameFilterChange(null)
				} else {
					props.handleNameFilterChange("num")
				}
			} else {
				props.handleNameFilterChange(e.target.innerText)
			}
		}		
	}
	
	return (
		<ul className="list-inline filterContainer" onClick={(e) => handleCharacterChange(e)}>
			<li className="list-inline-item" data-value="null">#</li>
			<li className="list-inline-item" data-value="num">0-9</li>
			<li className="list-inline-item">A</li>
			<li className="list-inline-item">B</li>
			<li className="list-inline-item">C</li>
			<li className="list-inline-item">D</li>
			<li className="list-inline-item">E</li>
			<li className="list-inline-item">F</li>
			<li className="list-inline-item">G</li>
			<li className="list-inline-item">H</li>
			<li className="list-inline-item">I</li>
			<li className="list-inline-item">J</li>
			<li className="list-inline-item">K</li>
			<li className="list-inline-item">L</li>
			<li className="list-inline-item">M</li>
			<li className="list-inline-item">N</li>
			<li className="list-inline-item">O</li>
			<li className="list-inline-item">P</li>
			<li className="list-inline-item">Q</li>
			<li className="list-inline-item">R</li>
			<li className="list-inline-item">S</li>
			<li className="list-inline-item">T</li>
			<li className="list-inline-item">U</li>
			<li className="list-inline-item">V</li>
			<li className="list-inline-item">W</li>
			<li className="list-inline-item">X</li>
			<li className="list-inline-item">Y</li>
			<li className="list-inline-item">Z</li>
		</ul>
	);
}

export default NameFilter;