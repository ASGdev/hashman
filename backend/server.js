const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
let locationApi = require('./api.location');
let fileApi = require('./api.file');
let authApi = require('./api.auth');

const app = express();

const secret = 'mysecretsshhh';

app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/location", locationApi);
app.use("/api/file", fileApi);
app.use("/api/auth", authApi);

const mongo_uri = 'mongodb://localhost/hashman';
mongoose.connect(mongo_uri, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.PORT || 8082);
