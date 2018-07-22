const express = require('express');
const app = express();

const checkAuth = require('./api/middleware/checkauth');
const jwt = require('jsonwebtoken');
const User = require('./api/models/user');
const router = express.Router();

var request = require('request');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/AdminLTE-2.4.3/AdminLTE-2.4.3'));

router.get('', (req, res) => {
  res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/login');
});
