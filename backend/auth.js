var express = require('express');
var router = express.Router();
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const withAuth = require('./withAuth');

const JWT_SECRET = 'mysecretsshhh';

router.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});
		
router.post('/logout', function(req, res) {
  res.clearCookie('token', { httpOnly: true }).sendStatus(200);
});

router.post('/authenticate', function(req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
        error: 'Internal error please try again'
      });
    } else if (!user) {
      res.status(401)
        .json({
        error: 'Incorrect email or password'
      });
    } else {
      user.checkPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
            error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401)
            .json({
            error: 'Incorrect email or password'
          });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

router.post('/logout', function(req, res) {
  res.clearCookie('token', { httpOnly: true }).sendStatus(200);
});
	
module.exports = router;
