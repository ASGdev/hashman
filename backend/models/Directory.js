const mongoose = require('mongoose');

const DirectorySchema = new mongoose.Schema({
	original : { 
		name: { type: String },
		size: { type: Number },
		content: [{
			path: { type: String },
			name: { type: String },
			size: { type: Number },
			creationDate: { type: Date },
			hash: {}
		}],
		creationDate: { type: Date },
		postDate: { type: Date, default: Date.now },
		tags: [{ type: String }],
		locationId: { type: String },
		locationName: { type: String },
		description: { type: String },
		path: { type: String }
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


module.exports = mongoose.model('Directory', DirectorySchema);