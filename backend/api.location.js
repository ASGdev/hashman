var express = require('express');
var router = express.Router();
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const Location = require('./models/Location');

router.get('/', async function(req, res) {
	Location.find({}, function(err, location) {
		if (err) {
		  console.error(err);
		  res.status(500)
			.json({
			error: 'Internal error please try again'
		  });
		} else if (!location) {
			res.json({})
		} else {
			res.json(location);
		}
	  });
});

router.get('/:id', async function (req, res) {
	Location.findOne({ _id: req.params.id }, function (err, location) {
		if (err) {
			console.error(err);
			res.status(500)
				.json({
					error: 'Internal error please try again'
				});
		} else if (!location) {
			res.json({})
		} else {
			res.json(location);
		}
	});
})
	
router.post('/', async function (req, res) {
	console.log(req.body)
	let loc = new Location()
	loc.name = req.body.name
	loc.uri = req.body.uri
	loc.description = req.body.description
	
	loc.save(function (err, l) {
			if (err) {
				console.log(err)
				res.status(500).send();
			} else {
				res.status(200).json({ "id": l.id });
			}
	});
})

router.put('/:id', async function (req, res) {
	Location.updateOne({ _id: req.params.id }, { $set: req.body }, function (err, location) {
		if (err) {
			console.error(err);
			res.status(500)
				.json({
					error: 'Internal error please try again'
				});
		} else if (!location) {
			res.json({})
		} else {
			res.json(location);
		}
	});
})

router.delete('/:id', async function (req, res) {
	Location.deleteOne({ _id : req.params.id }, function(err) {
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
