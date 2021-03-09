const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
	original : { 
		name: { type: String },
		size: { type: Number },
		hash: [{ type: { type: String }, value: { type: String } }],
		creationDate: { type: Date },
		tags: [{ type: String }],
		locationId: { type: String },
		locationName: { type: String },
		description: { type: String },
		path: { type: String },
		directoryId: { type: String, default: null },
		directoryName: { type: String, default: null }
	},
	copies : [{
		hash: [{ type: { type: String }, value: { type: String } }],
		name: { type: String },
		locationId: { type: String },
		uri: { type: String },
		isTemporary: { type: Boolean },
		date: { type: Date },
		description: { type: String, default: "" }
	}] 
});


module.exports = mongoose.model('File', FileSchema);