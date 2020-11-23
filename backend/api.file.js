var express = require('express');
var router = express.Router();
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const File = require('./models/File');
const Location = require('./models/Location');
const withAuthOrKey = require('./withAuthOrKey');

router.use(async function (req, res, next) {
	withAuthOrKey(req, res, next)
})

router.get('/', async function(req, res) {
	File.find({}, 'original', async function(err, files) {
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
		
router.get('/:id/copies', function(req, res) {
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
});
	
router.post('/', async function (req, res) {
	console.log("new file")
	console.log(req.body)
	let f = new File()
	f.original.name = req.body.n
	f.original.size = req.body.s
	f.original.hash = req.body.h
	f.original.creationDate = req.body.cd
	f.original.locationId = req.body.li
	f.original.locationName = req.body.ln || null
	f.original.path = req.body.p || null
	
	console.log(f)
	
	f.save(function (err, f) {
			if (err) {
				console.log(err)
				res.status(500).send();
			} else {
				res.status(200).json({ "id": f.id });
			}
		});
})

router.post('/:id/copy', async function (req, res) {
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
})

router.put('/:id', async function (req, res) {
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
})

router.delete('/:id', async function (req, res) {
	File.deleteOne({ _id : req.params.id }, function(err) {
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

router.delete('/:fileId/copy/:copyId', async function (req, res) {
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
})
	
module.exports = router;
