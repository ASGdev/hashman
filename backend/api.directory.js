var express = require('express');
var router = express.Router();
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const Directory = require('./models/Directory');
const Location = require('./models/Location');
const withAuthOrKey = require('./withAuthOrKey');

router.use(async function (req, res, next) {
	withAuthOrKey(req, res, next)
})

router.get('/', async function(req, res) {
	Directory.find({}, 'original', async function(err, files) {
		if (err) {
		  console.error(err);
		  res.status(500)
			.json({
			error: 'Internal error please try again'
		  });
		} else if (!files) {
			res.json({})
		} else {
			// map locationId with location name
			console.log(files)
			for (let index = 0; index < files.length; index++) {
				files[index] = files[index].toObject();
				if(files[index].original.locationId){
					let name = await Location.findOne({ _id: files[index].original.locationId }, 'name');
					if(name){
						files[index].original.location = name.name
					}
				}
				
			}
			res.json(files);
		}
	  });
});

/* get directories list (without content) */
router.get('/list', async function(req, res) {
	Directory.find({}, 'original.name original.path original.locationName original.size', async function(err, files) {
		if (err) {
		  console.error(err);
		  res.status(500)
			.json({
			error: 'Internal error please try again'
		  });
		} else if (!files) {
			res.json({})
		} else {
			// map locationId with location name
			console.log(files)
			for (let index = 0; index < files.length; index++) {
				files[index] = files[index].toObject();
				if(files[index].original.locationId){
					let name = await Location.findOne({ _id: files[index].original.locationId }, 'name');
					if(name){
						files[index].original.location = name.name
					}
				}
				
			}
			
			// clean object
			const dirs = files.map(file => {
				return {
					_id: file._id,
					name: file.original.name,
					path: file.original.path,
					locationName: file.original.locationName,
					size: file.original.size
				}
			})
			
			res.json(dirs);
		}
	  });
});

router.post('/compare', async function(req, res) {
	console.log("Comparing " + req.body.dirA + " with " + req.body.dirB)
	
	let sourceDir = await Directory.findOne({ _id: req.body.dirA }, 'original')
	let targetDir = await Directory.findOne({ _id: req.body.dirB }, 'original')
	
	console.log(sourceDir)
	
	let resultObject = {
		sizeUnmatch: null,
		fileNotFoundInTarget: [],
		fileChecksumUnmatch: [],
		fileNotFoundInSource: []
	}
	
	resultObject.sizeUnmatch = (sourceDir.original.size !== targetDir.original.size)
	
	sourceDir.original.content.forEach(file => {
		const path = file.path
		
		// check for missing file and sum mismatch in B side
		const fileUT = _.find(targetDir.original.content, { 'path': path})
		if(fileUT){
			if(file.hash.value !== fileUT.hash.value) {
				resultObject.fileChecksumUnmatch.push({
					path, 
					sourceFileHash: file.hash.value, 
					targetFileHash: fileUT.hash.value
				})
			}
		} else {
			resultObject.fileNotFoundInTarget.push(path)
		}
		
		// check for missing file in source dir
		if(targetDir.original.size > sourceDir.original.size){
			console.log("check for missing file in source dir")
			resultObject.fileNotFoundInSource = _.differenceBy(targetDir.original.content, sourceDir.original.content, 'path')
		}
	})
	
	console.log(resultObject)
	
	res.json(resultObject)
});
		
/*router.get('/:id/copies', function(req, res) {
	console.log("Getting copies for file " + req.params.id)
	File.findOne({ _id: req.params.id }, 'copies', function(err, file) {
		if (err) {
		  console.error(err);
		  res.status(500)
			.json({
			error: 'Internal error please try again'
		  });
		} else if (!file) {
		  res.status(404)
			.json({
			error: 'Project not found'
		  });
		} else {
			console.log(file);
			res.json(file.copies);
		}
	  });
});*/
	
router.post('/', async function (req, res) {
	console.log(req.body)
	
	const formattedContent = req.body.d.map(item => {
		return ({
			path: item.p,
			name: item.n,
			size: item.s,
			creationDate: item.c,
			hash: item.h
		})
	})
	
	let d = new Directory()
	
	d.original.name = req.body.n
	d.original.content = formattedContent
	d.original.locationId = req.body.li || null
	d.original.locationName = req.body.ln || null
	d.original.path = req.body.p || null
	d.original.description = req.body.de || null
	d.original.size = req.body.s
	
	d.save(function (err, d) {
			if (err) {
				console.log(err)
				res.status(500).send();
			} else {
				res.status(200).json({ "id": d.id });
			}
		});
})

/*router.post('/:id/copy', async function (req, res) {
	console.log(req.body)
	let file = await File.findOne({ _id : req.params.id }, 'copies');

	let copies = [...file.copies]

	copies.push(req.body);
	
	console.log(copies)
	
	File.updateOne({ _id : req.params.id }, { $set: { copies: copies } }, function(err, project) {
		if (err) {
		  console.error(err);
		  res.status(500)
			.json({
			error: 'Internal error please try again'
		  });
		} else if (!project) {
			res.json({})
		} else {
			res.json(project);
		}
	  });
})*/

/*router.put('/:id', async function (req, res) {
	let f = { "original.description": Object.values(req.body)[0] }

	File.updateOne({ _id: req.params.id }, { $set: f}, function (err, project) {
		if (err) {
			console.error(err);
			res.status(500)
				.json({
					error: 'Internal error please try again'
				});
		} else if (!project) {
			res.json({})
		} else {
			res.json(project);
		}
	});
})*/

router.delete('/:id', async function (req, res) {
	Directory.deleteOne({ _id : req.params.id }, function(err) {
		if (err) {
		  console.error(err);
		  res.status(500)
			.json({
			error: 'Internal error please try again'
		  });
		} else {
			res.status(200).json({});
		}
	  });
})

/*router.delete('/:fileId/copy/:copyId', async function (req, res) {
	File.update({
		_id: req.params.fileId
	}, {
		$pull: {
		  copies: {
			_id: req.params.copyId
		  }
		}
	}, function(err) {
		if (err) {
		  console.error(err);
		  res.status(500)
			.json({
			error: 'Internal error please try again'
		  });
		} else {
			res.status(200).json({});
		}
	});
})*/
	
module.exports = router;
