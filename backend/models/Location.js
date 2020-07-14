const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
	name: { type: String },
	uri : { type: String },
	description: { type: String },
	meta: []
});


module.exports = mongoose.model('Location', LocationSchema);