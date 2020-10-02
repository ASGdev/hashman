const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	email: { type: String },
	password : { type: String },
	apikey: { type: String }
});

UserSchema.methods.checkPassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
}

UserSchema.statics.checkApiKey = function(key, callback) {
	return this.model('User').findOne({ apikey: key }, 'email')
}

module.exports = mongoose.model('User', UserSchema);