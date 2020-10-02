const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
const User = require('./models/User');

const withAuthOrKey = async function(req, res, next) {
	const token = 
		req.body.token ||
		req.query.token ||
		req.headers['x-access-token'] ||
		req.cookies.token;
	const key = req.headers['x-api-key'] 
	
	if(key){
		let resp = await User.checkApiKey(key);
		if(resp){
			console.log(resp)
			req.apiuser = resp
			next()
		} else {	
			res.status(401).send('Unauthorized: Invalid key');
		}
	} else {
		if (!token) {
			res.status(401).send('Unauthorized: No token provided');
		} else {
				jwt.verify(token, secret, function(err, decoded) {
					if (err) {
						res.status(401).send('Unauthorized: Invalid token');
					} else {
						req.email = decoded.email;
						next();
					}
				});
		}
	}
}

module.exports = withAuthOrKey;