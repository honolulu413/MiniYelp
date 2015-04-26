//var express = require('express');
//var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//	res.render('login', { title: 'hello' });
//});

var APP_USERS = require('../lib/table').APP_USERS;
var database = require('../lib/database');
var requestQueryParser = require('../lib/requestQueryParser');
var getData = require('../lib/row.js').getData;

function post(request, response) {
	var row = requestQueryParser.parse(request, ["USER_NAME_ID", "PASSWORD"]);
	var exists;
	database.allExist(APP_USERS, row, function(err, bool) {
		if (err === null) {
			if (bool) {
				// successfully log in. redirect to homepage
				request.session.username = getData(row, "USER_NAME_ID");

				response.writeHead(302, {
					  'Location': '/user/' + getData(row, 'USER_NAME_ID')
				});
				response.end();		
			} else {
				response.render('login.jade', {
					message: 'Incorrect username and password combination',
					schema: APP_USERS.schema,
					label: APP_USERS.label
				});
			}
		}
	});
	
}


exports.post = post;

