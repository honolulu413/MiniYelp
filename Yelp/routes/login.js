//var express = require('express');
//var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//	res.render('login', { title: 'hello' });
//});

var APP_USERS = require('../lib/table').APP_USERS;

exports.do_work = function(req, res){
	  res.render('login.jade', { 
		  title: 'hello',
		  schema: APP_USERS.schema,
		  label: APP_USERS.label
	  });
	};

